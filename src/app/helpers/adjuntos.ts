import { i_file } from "&interface/file";
import { i_email_attachment } from "&interface/mail";
import fs from 'fs';
import { resolve } from 'path';


export const adjuntos = (adjuntos:Array<any>, id_conv: number, isUpdate:boolean) => {

    let ruta = `${resolve(__dirname, `../files/convocatoria/${id_conv}`)}`;

    if(!fs.existsSync(ruta)){
        fs.mkdirSync(ruta,{recursive: true});
    }

    const data_adjuntos = [];

    for (const i in adjuntos) {
        const {name,data,mv}:i_file = adjuntos[i];
        mv(`${ruta}/${name}`);
        data_adjuntos.push({
            filename: name,
            content: data
        });
    }


    if ( isUpdate ) {
        let dir = fs.readdirSync(ruta);
        const dataread = [];
        
        for (const i in dir) {
            dataread.push({
                filename: dir[i],
                content: fs.readFileSync(`${ruta}/${dir[i]}`)
            })
        }
        
        dataread.push(...data_adjuntos);

        return dataread;
    }else {
        return data_adjuntos;
    }

}