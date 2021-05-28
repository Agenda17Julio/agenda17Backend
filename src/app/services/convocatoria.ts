import { json, Request, Response } from 'express';
import { i_email } from '@interface/mail';
import { adjuntos } from '@helpers/adjuntos';
import Email from '@mail/index';
import fileUpload from 'express-fileupload';
import Database from '@database/index';
import moment from 'moment';
import { hasJSDocParameterTags } from 'typescript';


const db = Database.init().connection;
const email = Email.init();


export const sendMail = (req:Request,res:Response) => {

    const { from, to, asunto, detalle, fecha,usuario  } = JSON.parse(req.body.data);
    const files = req.files as fileUpload.FileArray;

    let emailConfig:i_email = {
        from,
        to,
        subject: asunto,
        html: detalle
    }

    if( files ) {
        let file_adjuntos = files.adjuntos as Array<any>;

        
        if( !Array.isArray(file_adjuntos) ) {
            const aux = file_adjuntos;
            file_adjuntos = [];
            file_adjuntos[0] = aux;
        }
        
        emailConfig = {
            ...emailConfig,
            attachments: adjuntos(file_adjuntos)
        }
    }

    email.sendMail( emailConfig, async (err:any) => {
        if( err ) return res.status(500).json({
            ok: false,
            msg: 'Oh no! ocurrio un error inesperado, Por favor contacta con un administrador',
            err
        });

        const sql = `insert into Convocatoria(asunto,fecha,detalle,usuario) values(?,?,?,?);`;

        // aun falta controlar la hora, ademas, guardar la convocatoria cuando esta tenga adjunto
        await db.execute(sql,[ asunto, moment(fecha).format('yyyy-MM-DD'), detalle,usuario ]);

        return res.status(200).json({
            ok: true,
            msg: 'Convocatoria enviada y registrada con exito'
        })
    })
};


export const getAllAnnoucements = async( req:Request, res:Response ) => {

    const { pagina } = req.params;

    if( !pagina  ) return res.status(404).json({
        ok: false,
        msg: 'Incluir el parametro para el numero de pagina'
    });

    const cant_registros = 10;
    const inicio = cant_registros * Number(pagina) - cant_registros;


    const sql = `select c.id, c.asunto, c.fecha, c.detalle, c.adjunto, u.username as usuario
        from Convocatoria c
        inner join Usuario u
        where c.usuario=u.id
        order by c.id asc 
        limit ? 
        offset ?;`;

    const [ data ] = await db.execute(sql,[cant_registros.toString(),inicio.toString()]);
    const [ registros ] = await db.execute('select count(*) as registros from Convocatoria;');

    if( !data || !registros ) return res.status(404).json({
        ok: false,
        msg: 'no existen convocatorias'
    });

    return res.json({
        ok: true,
        data,
        registros
    });
};



export const getActiveAnnoucements = async (req:Request, res:Response) => {

    const currentDate = moment(Date.now());

    const sql = `select * 
        from Convocatoria 
        where fecha >= ?;`

    const [ data ] = await db.execute(sql,[currentDate.format('yyyy-MM-DD HH:mm')]);

    if( !data ) return res.status(404).json({
        ok: false,
        msg: 'no existen convocatorias'
    });

    return res.json({
        ok: true,
        data
    });
}


export const deleteAnnucements = async (req:Request, res:Response) => {
    const { id } = req.params;

    const sql = 'delete from Convocatoria where id=?';

    await db.execute(sql,[id]);

    return res.json({
        ok: true,
        msg: 'Convocatoria eleminada correctamente!'
    });
}


export const getUsers = async (req:Request,res:Response) => {
    const sql = `select p.correo
        from Usuario u 
        inner join Persona p 
        on u.persona=p.id`;

    const [ data ] = await db.execute(sql);

    return res.json({
        ok: true,
        data
    });
}
