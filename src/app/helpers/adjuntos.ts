import { i_file } from "@interface/file";
import { i_email_attachment } from "@interface/mail";
import fs from 'fs';
import { resolve } from 'path';


export const adjuntos = (adjuntos:Array<any>, id_conv: number) => {

    let ruta = `${resolve(__dirname, `../files/${id_conv}`)}`;

    console.log(ruta);
    if(!fs.existsSync(ruta)){
        fs.mkdirSync(ruta);
    }

    return adjuntos.map(( {name,data,mv}:i_file, index:number ) => {
        
        const ext = name.substring(name.lastIndexOf('.'),name.length);
        const filename = `${new Date().getTime()}${index}${ext}`;
        mv(`${ruta}/${filename}`);

        const adjunto:i_email_attachment = {
            filename,
            content: data
        };

        return adjunto;
    })
}