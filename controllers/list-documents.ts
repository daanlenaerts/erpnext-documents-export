export interface ListDocumentsOptions {
    url: string;
    key: string;
    secret: string;
    doctype: string;
    lastTimestamp: string | null;
    docstatus?: number;
}

export async function listDocuments(opts: ListDocumentsOptions){
    const options = {
        method: 'GET',
        headers: {
            Authorization: 'Basic ' + Buffer.from(`${opts.key}:${opts.secret}`).toString('base64')
        }
    };

    let url = opts.url + `/api/resource/${opts.doctype}?` + new URLSearchParams({
        fields: JSON.stringify(["name"]),
        order_by: "modified",
        limit_page_length: "500",
        ...(opts.lastTimestamp ? { filters: JSON.stringify([["modified", ">=", opts.lastTimestamp]]) } : {}),
        ...(opts.docstatus !== undefined ? { filters: JSON.stringify([["docstatus", "=", opts.docstatus]]) } : {})
    }).toString();

    const res = await fetch(url, options);

    if (res.ok) {
        return (await res.json()).data;
    }else{
        return [];
    }
}