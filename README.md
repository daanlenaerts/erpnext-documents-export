<p align="center" style="font-size: 40px;">🗂️</p>
<h1 align="center">ERPNext Documents Export</h1>

A simple command line utility to automatically export ERPNext or Frappe documents to PDF (and JSON).

**Why?** While using ERPNext we were looking for a way to always have our submitted sales and purchase invoices available in PDF format, for easy referencing.
This simple tool does just that.

# How to use?

## Binary executable

For ease of use this tool is distributed as a single binary. It runs on Windows, macOS and Linux.

You can download it for different operating systems here:
- [Linux x64](https://github.com/daanlenaerts/erpnext-documents-export/releases/download/v1.0.0/ede-linux-x64)
- [macOS arm64](https://github.com/daanlenaerts/erpnext-documents-export/releases/download/v1.0.0/ede-macos-arm64)
- [macOS x64](https://github.com/daanlenaerts/erpnext-documents-export/releases/download/v1.0.0/ede-macos-x64)
- [Windows x64](https://github.com/daanlenaerts/erpnext-documents-export/releases/download/v1.0.0/ede-windows-x64)


## With Bun

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

To build:

```bash
bun build ./index.ts --compile --outfile ede

# For Linux x64
bun build --compile --target=bun-linux-x64 ./index.ts --outfile ede-linux-x64

# For Windows x64
bun build --compile --target=bun-windows-x64 ./index.ts --outfile ede-windows-x64

# For macOS arm64
bun build --compile --target=bun-darwin-arm64 ./index.ts --outfile ede-macos-arm64

# For macOS x64
bun build --compile --target=bun-darwin-x64 ./index.ts --outfile ede-macos-x64

```

This project was created using `bun init` in bun v1.1.0. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
