import path from 'path';
import { exists } from "node:fs/promises";

export async function writeProgressFile(lastTimestamp: number, targetDir: string) {
    const targetFile = path.join(targetDir, '.erpnext-documents-export');

    const info = {
        lastTimestamp,
    }

    await Bun.write(targetFile, JSON.stringify(info));
}

export async function readProgressFile(targetDir: string) {
    const targetFile = path.join(targetDir, '.erpnext-documents-export');
    if (!await exists(targetFile)) {
        return null;
    }

    const info = await Bun.file(targetFile).text();
    return JSON.parse(info);
}

export async function getLastTimestamp(targetDir: string) {
    const info = await readProgressFile(targetDir);
    if (info === null) {
        return null;
    }
    return info.lastTimestamp;
}