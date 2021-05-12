import { i_file } from "@interface/file";
import { i_email_attachment,i_email } from "@interface/mail";

export const adjuntos = (adjuntos:Array<any>) => {
    return adjuntos.map(( {name,data}:i_file, index:number ) => {

        const ext = name.substring(name.lastIndexOf('.'),name.length);

        const adjunto:i_email_attachment = {
            filename: `${new Date().getTime()}${index}${ext}`,
            content: data
        };

        return adjunto;
    })
}