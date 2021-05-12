export interface i_file {
    name: string;
    data: Buffer;
    size: number;
    encoding: StaticRangeInit;
    tempFilePath: string;
    truncated: boolean;
    mimetype: string;
    md5: string;
    mv: Function;
}