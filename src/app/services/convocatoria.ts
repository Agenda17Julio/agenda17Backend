import { Request, Response } from 'express';
import { i_email } from '@interface/mail';
import { adjuntos } from '@helpers/adjuntos';
import Email from '@mail/index';
import fileUpload from 'express-fileupload';
import { Paginacion } from '@helpers/paginacion';
import Database from '@database/index';
import moment from 'moment';


const db = Database.init().connection;
const email = Email.init();


export const sendMail = (req:Request,res:Response) => {

    const files = req.files as fileUpload.FileArray;
    let file_adjuntos = files.adjuntos as Array<any>;
    const { from, to,asunto,detalle  } = JSON.parse(req.body.data);

    let emailConfig:i_email = {
        from,
        to,
        subject: asunto,
        html: detalle
    }

    if( file_adjuntos ) {

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
    

    email.sendMail( emailConfig, (err:any) => {
        if( err ) return res.status(500).json({
            ok: false,
            msg: 'Oh no! ocurrio un error inesperado, Por favor contacta con un administrador',
            err
        });

        return res.json({
            ok: true,
            msg: 'Email enviado correctamente!'
        })
    });
};


export const getAllAnnoucements = async( req:Request, res:Response ) => {

    const { pagina } = req.params;

    if( !pagina  ) return res.status(404).json({
        ok: false,
        msg: 'Incluir el parametro para el numero de pagina'
    });

    const { sql, data:info } = Paginacion({
        table: 'Convocatoria',
        pagina: Number(pagina),
        registros: 10
    });

    const [ data ] = await db.execute(sql,info);

    if( !data ) return res.status(404).json({
        ok: false,
        msg: 'no existen convocatorias'
    });

    return res.json({
        ok: true,
        data
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
