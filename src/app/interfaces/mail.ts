export interface i_email {
    from: i_email_from,
    to: Array<string>,
    subject: string;
    text?:string;
    html?:string;
    attachments?: Array<i_email_attachment>
}

export interface i_email_from {
    name: string;
    address: string;
}

export interface i_email_attachment {
    filename: string;
    path?: string;
    content?: Buffer | string ;
    href?: string;
    httpHeaders?: string;
    contentType?: string;
    encoding?: string;
    raw?: string;
}