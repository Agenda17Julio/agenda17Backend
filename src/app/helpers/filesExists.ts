import { Response } from 'express';
import { resolve } from 'path';
import fs from 'fs';


export const filesExists = (data:Array<any>, res:Response) => {
    if( !data ) return res.status(404).json({
        ok: false,
        msg: 'no existen convocatorias'
    });

    const registros = data as any;

    for (const i in registros) {
        const id = registros[i]['id'];
        const path = resolve(__dirname, `../files/${id}`);
        if( fs.existsSync(path)) {
            registros[i].files = fs.readdirSync(path);;
        };
    }

    return registros;
}