import { exportToPdf } from "./controllers/export-to-pdf";
import { listDocuments } from "./controllers/list-documents";
import { getLastTimestamp, writeProgressFile } from "./controllers/progress-file";

const { Command } = require('commander');
const program = new Command();

program
    .name('erpnext-documents-export')
    .description('CLI to export ERPNext documents periodically')
    .option('-u, --url <url>', 'ERPNext URL')
    .option('-k, --key <key>', 'API key')
    .option('-s, --secret <secret>', 'API secret');

program.command('watch')
    .description('watch for changes in ERPNext documents')
    .argument('<doctype>', 'DocType to watch')
    .option('-t, --target-dir <dir>', 'target directory to save files', './')
    .option('-f, --print-format <format>', 'format to export')
    .option('-d, --date-field <field>', 'date field to use', 'posting_date')
    .option('--include-json', 'also export JSON file')
    .action(async (doctype: string, options: any) => {
        while (true) {
            try {
                const lastTimestamp = await getLastTimestamp(options.targetDir);
                const documents = await listDocuments({
                    url: program.opts().url,
                    key: program.opts().key,
                    secret: program.opts().secret,
                    doctype: doctype,
                    lastTimestamp,
                });
                let newLastTimestamp = lastTimestamp;
                for (const doc of documents) {
                    try {

                        const exportedDocument = await exportToPdf({
                            url: program.opts().url,
                            key: program.opts().key,
                            secret: program.opts().secret,
                            doctype: doctype,
                            name: doc.name,
                            dateField: options.dateField,
                            targetDir: options.targetDir,
                            printFormat: options.printFormat,
                            includeJson: options.includeJson
                        });

                        if (exportedDocument !== null && (newLastTimestamp === null || exportedDocument.modified > newLastTimestamp)) {
                            newLastTimestamp = exportedDocument.modified;
                            await writeProgressFile(newLastTimestamp, options.targetDir);
                        }
                    } catch (e) {
                        console.error("Failed to export document", doc.name);
                        console.error(e);
                    }
                }
            } catch (e) {
                console.error("Failed to list documents");
                console.error(e);
            }

            // Sleep for 10 seconds
            await new Promise((resolve) => setTimeout(resolve, 10000));
        }
    });

program.parse();