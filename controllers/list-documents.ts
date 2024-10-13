export interface ListDocumentsOptions {
    url: string;
    key: string;
    secret: string;
    doctype: string;
    lastTimestamp: string | null;
}

export async function listDocuments(opts: ListDocumentsOptions){
    const options = {
        method: 'GET',
        headers: {
            Authorization: 'Basic ' + Buffer.from(`${opts.key}:${opts.secret}`).toString('base64')
        }
    };

    let url = opts.url + `/api/resource/${opts.doctype}?fields=["name"]&order_by="modified"&limit_page_length=500`;
    if(opts.lastTimestamp){
        url += `&filters=[["modified", ">=", "${opts.lastTimestamp}"]]`;
    }

    const res = await fetch(url, options);

    if (res.ok) {
        return (await res.json()).data;
    }else{
        return [];
    }
}