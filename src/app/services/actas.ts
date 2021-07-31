import Database from '@database/index';
import { Request, Response } from 'express';
import { resolve } from 'path';
import { mkdirSync, existsSync, unlinkSync, rmdirSync } from 'fs';
import { readdirSync } from 'fs';

const db = Database.init().connection;

export const addNewActa = async (req:Request, res:Response) => {

    const { conv_id } = req.query;

    if( !req.files ) return res.status(400).json({
        ok: false,
        msg: "Files doesn't exists"
    });

    const [ data ] = await db.execute('insert into actas (convocatoria) values(?);',[conv_id]);
    const id = (data as any)['insertId'];

    let file_adjuntos = req.files.actasadj as Array<any>;
    
    if( !Array.isArray(file_adjuntos) ) {
        const aux = file_adjuntos;
        file_adjuntos = [];
        file_adjuntos[0] = aux;
    }

    let path = resolve(__dirname, `../files/actas/${id}`);
    if( !existsSync(path)){
        mkdirSync(path);
    }
                    
    const adjuntos_res:any = [];

    for (const i in file_adjuntos) {
        const { name, data, mv }:{name:string, data:Buffer, mv:Function} = file_adjuntos[i];
        mv(`${path}/${name}`);
        const [ adj ] = await db.execute('insert into actaAdjuntos(filename,acta) values(?,?);',[name, id]);

        adjuntos_res.push({
            filename: name,
            id: (adj as any)['insertId'],
            acta: id
        })
    }


    return res.json({
        ok: true,
        id_acta:id,
        adjuntos_res
    })
}

export const updateActa = async(req:Request, res: Response) => {
    const id_acta = req.params.id_acta;

    if( !req.files ) return res.status(400).json({
        ok: false,
        msg: "Files doesn't exists"
    });

    let file_adjuntos = req.files.actasadj as Array<any>;
    
    if( !Array.isArray(file_adjuntos) ) {
        const aux = file_adjuntos;
        file_adjuntos = [];
        file_adjuntos[0] = aux;
    }

    let path = resolve(__dirname, `../files/actas/${id_acta}`);
    if( !existsSync(path)){
        mkdirSync(path);
    }

    const adjuntos_res:any = [];

    for (const i in file_adjuntos) {
        const { name, data, mv }:{name:string, data:Buffer, mv:Function} = file_adjuntos[i];
        mv(`${path}/${name}`);
        const [ adj ] = await db.execute('insert into actaAdjuntos(filename,acta) values(?,?);',[name, id_acta]);
        
        adjuntos_res.push({
            id: (adj as any)['insertId'],
            filename: name,
            acta: Number(id_acta)
        })
    }

    res.json({
        ok: true,
        adjuntos_res
    })
}

export const deleteActa = async(req:Request, res:Response) => {
    const id_acta = req.params.id_acta;

    const path = resolve(__dirname, `../files/actas/${id_acta}`);

    if( !existsSync(path) ) return res.status(500).json({
        ok: false,
        msg: 'Something went wrong!'
    });

    const files = readdirSync(path);
    files.map(async file => {
        await db.execute('delete from actaAdjuntos where acta=?', [id_acta]);
        unlinkSync(`${path}/${file}`);
    });

    await db.execute('delete from actas where id=?',[id_acta]);
    rmdirSync(path);

    res.json({
        ok: true,
        msg: 'Acta deleted successfully'
    })
}

export const getAllActas = async (req:Request, res: Response) => {

    const { pagina } = req.params;
    const { payload:{ rol,email } } = req.body.payload;

    // const sql = (info:string) => `select ${info}
    //     from actas a
    //     inner join Convocatoria c
    //     on a.convocatoria = c.id
    //     order by a.id`;

    const sql = (info:string) => `select ${info}
        from actas act
        inner join Convocatoria conv
        on act.convocatoria = conv.id
        inner join Usuario u 
        on conv.usuario=u.id
        where u.rol=${rol}
        and conv.destinatarios like '%${email}%'
        order by act.id`;


    const cant_registros = 10;
    const inicio = cant_registros * Number(pagina) - cant_registros;
        
    const [ data ] = await db.execute(`${sql('act.id, conv.id as id_conv, conv.asunto')} limit ? offset ?;`,[
        cant_registros.toString(),
        inicio.toString()
    ]);

    const actas = data as any[];


    const [ reg ] = await db.execute(sql('count(*) as registros'),[rol,email]);


    for (const i in actas) {
        const sqladjuntos = `select * from actaAdjuntos where acta=?;`
        const [ conv ] = await db.execute(sqladjuntos, [actas[i].id]);
        actas[i].adjuntos = conv;
    }

    return res.json({
        ok: true,
        actas,
        registros: (reg as any)[0].registros
    })
}

export const getAnnoucementsActas = async (req:Request, res: Response) => {

    const [data] = await db.execute('select id, asunto from Convocatoria');

    return res.json({
        ok: true,
        data
    })
}

export const getAllAdjuntosActa = async (req:Request, res: Response) => {

    const id = req.params.id_acta;

    const [ data ] = await db.execute('select id,filename from actaAdjuntos where acta=?;', [id]);

      
    return res.json({
        ok: true,
        id,
        data
    })
}

export const getAdjunto  = async (req:Request, res: Response) => {

    const { id_acta, filename } = req.params;
    const path = resolve(__dirname, `../files/actas/${id_acta}/${filename}`);

    if( !existsSync(path) ) return res.status(500).json({
        ok: false,
        msg: 'Something went wrong!'
    });
    
    return res.download(path);
}

export const deleteAdjunto = async (req:Request, res: Response) => {
    
    const { id_acta, filename } = req.params;
    const path = resolve(__dirname, `../files/actas/${id_acta}`);
    
    if( !existsSync(`${path}/${filename}`) ) return res.status(500).json({
        ok: false,
        msg: 'Something went wrong!'
    });

    unlinkSync(`${path}/${filename}`);

    await db.execute('delete from actaAdjuntos where acta=? and filename=?',[id_acta, filename])

    return res.json({
        ok: true,
        msg: 'File was deleted'
    })

}