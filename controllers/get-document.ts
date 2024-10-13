export interface GetDocumentOptions {
    url: string;
    key: string;
    secret: string;
    doctype: string;
    name: string;
}

export async function getDocument(opts: GetDocumentOptions) {
    const options = {
        method: 'GET',
        headers: {
            Authorization: 'Basic ' + Buffer.from(`${opts.key}:${opts.secret}`).toString('base64')
        }
    };

    const url = opts.url + `/api/resource/${opts.doctype}/${opts.name}`;

    const res = await fetch(url, options);

    if (res.ok) {
        return (await res.json()).data;
    }else{
        return null;
    }
}