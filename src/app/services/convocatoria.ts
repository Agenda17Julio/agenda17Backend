'use strict';
import { Request, Response } from 'express';
import { i_email } from '@interface/mail';
import { adjuntos } from '@helpers/adjuntos';
import Email from '@mail/index';
import fileUpload from 'express-fileupload';
import Database from '@database/index';
import moment from 'moment';
import { searchconv } from '../helpers/sql/convocatorias';
import { resolve } from 'path';
import fs from 'fs';



const db = Database.init().connection;
const email = Email.init();


export const sendMail = async (req:Request,res:Response) => {

        const { from, to, asunto, detalle, fecha,usuario  } = JSON.parse(req.body.data);
        const files = req.files as fileUpload.FileArray;
        let archivos:Array<any> = [];

        let emailConfig:i_email = {
            from,
            to,
            subject: asunto,
            html: detalle
        }

        if( !from || !to ) return res.status(400).json({
            ok: false,
            msg: 'no existe destinatario o información del usuario que remite el correo'
        });

        if( moment(fecha).isValid() && moment(fecha) >= moment(new Date()) ) {

            const sql = `insert into Convocatoria(asunto,fecha,detalle,usuario,destinatarios) values(?,'${moment(fecha).format('yyyy-MM-DD HH:mm')}',?,?,?);`;
        
            const [data, info] = await db.execute(sql,[ asunto, detalle,usuario, JSON.stringify(to) ]);
            const id = (data as any)['insertId'];

            if( files ) {
                let file_adjuntos = files.adjuntos as Array<any>;
                
                if( !Array.isArray(file_adjuntos) ) {
                    const aux = file_adjuntos;
                    file_adjuntos = [];
                    file_adjuntos[0] = aux;
                }
                
                archivos = adjuntos(file_adjuntos, id);
        
                emailConfig = {
                    ...emailConfig,
                    attachments: archivos
                }


                if ( archivos.length > 0 ){
                    
                    archivos.forEach( async({ filename }:{filename:string}) => {
                        const name = filename.substring( 0, filename.lastIndexOf('.'));
                        const sql = `insert into AdjuntoConvocatoria(convocatoria, nombre) values(?,?);`;
                        await db.execute(sql,[id,name]);
                    });
                }
            }

       
            email.sendMail( emailConfig, (err: Error ) => {
                if( err ) return res.status(500).json({
                    ok: false,
                    msg: 'Oh no! ocurrio un error inesperado, Por favor contacta con un administrador',
                    err
                })
    
                return res.status(200).json({
                    ok: true,
                    msg: 'Convocatoria enviada y registrada con exito',
                    id
                })
                
            });

        }else {
            return res.status(400).json({
                ok: false,
                msg: 'La fecha y hora especificada no son válidas para el día seleccionado'
            });
        }

   
};

export const getAllAnnoucements = async( req:Request, res:Response ) => {

    const { pagina } = req.params;

    if( !pagina  ) return res.status(404).json({
        ok: false,
        msg: 'Incluir el parametro para el numero de pagina'
    });

    const cant_registros = 10;
    const inicio = cant_registros * Number(pagina) - cant_registros;


    const sql = `select c.id, c.asunto, c.fecha, c.detalle,  c.destinatarios as 'to', u.username as usuario
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

    const sql = `select c.id, c.asunto, c.fecha, c.detalle, c.usuario, c.destinatarios as 'to'
        from Convocatoria c
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

    const children = `delete ad
        from AdjuntoConvocatoria ad
        inner join Convocatoria c
        on ad.convocatoria=c.id
        where c.id=?;`

    const sql = 'delete from Convocatoria where id=?';

    await db.execute(children,[id]);
    await db.execute(sql,[id]);

    let ruta = `${resolve(__dirname, `../files/${id}`)}`;
    if( fs.existsSync(ruta) ){
        fs.rmdirSync(ruta,{recursive:true});
    }

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



export const searchConvocatoria = async (req:Request, res: Response) => {

    const { sql,sql_registros } = searchconv(req,res);

    const [ data ] = await db.execute(sql);
    const [ registros ] = await db.execute(sql_registros);
 
    if( !data || !registros ) return res.status(404).json({
        ok: false,
        msg: 'no existen convocatorias'
    });

    return res.status(200).json({
        ok: true,
        data,
        registros
    })
}

export const updateAnnoucements = async(req:Request, res:Response) => {
    const { id } = req.params;
    const { asunto,fecha,detalle,to } = req.body;

    if( !asunto || !fecha || !detalle || !to ) return res.status(400).json({
        ok: false, 
        msg: 'envie todos los parametros'
    })

    const sql = `update Convocatoria
        set asunto=?,
        fecha=?,
        detalle=?,
        destinatarios=?
        where id=?`;

    await db.execute(sql,[asunto,moment(fecha).format('yyyy-MM-DD HH:mm'),detalle,JSON.stringify(to), id]);

    return res.json({
        ok: true,
        msg: 'Convocatoria actualizada correctamente!'
    });
}