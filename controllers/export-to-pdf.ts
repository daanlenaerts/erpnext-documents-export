import dayjs from "dayjs";
import { getDocument } from "./get-document";
import path from 'path';
import { exists, mkdir } from "node:fs/promises";

export interface ExportToPdfOptions {
    url: string;
    key: string;
    secret: string;
    doctype: string;
    name: string;
    dateField: string;
    targetDir: string;
    printFormat?: string;
    includeJson?: boolean;
}

export async function exportToPdf(opts: ExportToPdfOptions) {

    const options = {
        method: 'GET',
        headers: {
            Authorization: 'Basic ' + Buffer.from(`${opts.key}:${opts.secret}`).toString('base64')
        }
    };

    const document = await getDocument(opts);
    if (document === null) {
        throw new Error(`Error fetching ${opts.doctype} ${opts.name}`);
    }
    const date = dayjs(document[opts.dateField]);
    const targetDir = path.join(opts.targetDir, date.get('year').toString(), date.format('MM'));

    const url = opts.url + `/api/method/frappe.utils.print_format.download_pdf?` + new URLSearchParams({
        doctype: opts.doctype,
        name: opts.name,
        ...(opts.printFormat ? { format: opts.printFormat } : {}),
        no_letterhead: '1',
        settings: '{}',
        // _lang: 'en'
    }).toString();

    const res = await fetch(url, options);

    if (res.ok) {
        const buffer = await res.arrayBuffer();

        // Create the target directory if it doesn't exist
        if (!await exists(targetDir)) {
            await mkdir(targetDir, { recursive: true });
        }

        // Save the PDF file if it doesn't exist
        const pdfFilename = path.join(targetDir, `${opts.name}.pdf`);

        if (await exists(pdfFilename)) {
            // Stop processing if the file already exists
            return null;
        }

        console.log(`Saving ${opts.doctype} ${opts.name} to ${pdfFilename}`);
        await Bun.write(pdfFilename, buffer);

        if (opts.includeJson) {
            // Save the json file
            const jsonFilename = path.join(targetDir, `${opts.name}.json`);
            console.log(`Saving ${opts.doctype} ${opts.name} to ${jsonFilename}`);
            await Bun.write(jsonFilename, JSON.stringify(document));
        }

        return document;

    } else {
        console.error(`Error exporting ${opts.doctype} ${opts.name} to PDF: ${res.status} ${res.statusText}`);
    }

    return null;
}