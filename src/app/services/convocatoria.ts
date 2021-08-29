'use strict';
import { Request, Response } from 'express';
import { i_email } from '&interface/mail';
import { adjuntos } from '&helpers/adjuntos';
import Email from '&mail/index';
import fileUpload from 'express-fileupload';
import Database from '&database/index';
import moment from 'moment';
import { searchconv } from '../helpers/sql/convocatorias';
import { filesExists } from '../helpers/filesExists';
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
                
                archivos = adjuntos(file_adjuntos, id, false);
        
                emailConfig = {
                    ...emailConfig,
                    attachments: archivos
                }

                if ( archivos.length > 0 ){
                    
                    archivos.forEach( async({ filename }:{filename:string}) => {
                        const sql = `insert into AdjuntoConvocatoria(convocatoria, nombre) values(?,?);`;
                        await db.execute(sql,[id,filename]);
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
    const { payload:{ rol, email } } = req.body.payload;

    if( !pagina  ) return res.status(404).json({
        ok: false,
        msg: 'Incluir el parametro para el numero de pagina'
    });

    const cant_registros = 10;
    const inicio = cant_registros * Number(pagina) - cant_registros;
    let sql = '';
    let sql_reg = '';

    if( rol === 1 ){

        sql = `select c.id, c.asunto, c.fecha, c.detalle,  c.destinatarios as 'to', u.username as usuario
            from Convocatoria c
            inner join Usuario u
            on c.usuario=u.id
            order by c.id asc 
            limit ? 
            offset ?;`;
        sql_reg = `select count(*) as registros from Convocatoria;`;
    }else {
        sql = `select c.id, c.asunto, c.fecha, c.detalle,  c.destinatarios as 'to', u.username as usuario
            from Convocatoria c
            inner join Usuario u
            on c.usuario=u.id
            where c.destinatarios like '%${email}%'
            order by c.id asc 
            limit ? 
            offset ?;`;
        
        sql_reg = `select count(*) as registros from Convocatoria where destinatarios like '%${email}%';`;
    }
   

    const [ data ] = await db.execute(sql,[cant_registros.toString(),inicio.toString()]);
    const [ registros ] = await db.execute(sql_reg);

    if( !data || !registros ) return res.status(404).json({
        ok: false,
        msg: 'no existen convocatorias'
    });

    const registrosdata = filesExists(data as any, res);

    return res.json({
        ok: true,
        data: registrosdata,
        registros
    });
};

export const getActiveAnnoucements = async (req:Request, res:Response) => {

    const { payload:{ rol, email } } = req.body.payload;
    const currentDate = moment(Date.now());

    let sql = '';

    if( rol === 1 ) {
        sql = `select c.id, c.asunto, c.fecha, c.detalle, c.usuario, c.destinatarios as 'to'
            from Convocatoria c
            where fecha >= ?;`
    }else {
        sql = `select c.id, c.asunto, c.fecha, c.detalle, c.usuario, c.destinatarios as 'to'
            from Convocatoria c
            where c.destinatarios like '%${email}%'
            and fecha >= ?;`
    }


    const [ data ] = await db.execute(sql,[currentDate.format('yyyy-MM-DD HH:mm')]);

    const registros = filesExists(data as any,res);

    return res.json({
        ok: true,
        data:registros
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
    const { from, to, asunto, detalle, fecha  } = JSON.parse(req.body.data);

    const files = req.files as fileUpload.FileArray;
    let archivos:Array<any> = [];

    let emailConfig:i_email = {
        from,
        to,
        subject: `${asunto} - actualización de convocatoria ${id}`,
        html: detalle
    }


    if( moment(fecha).isValid() && moment(fecha) >= moment(new Date()) ) {

        const sql = `update Convocatoria
            set asunto=?,
            fecha=?,
            detalle=?,
            destinatarios=?
            where id=?`;

        await db.execute(sql,[asunto,moment(fecha).format('yyyy-MM-DD HH:mm'),detalle,JSON.stringify(to), id]);     

        let ruta = `${resolve(__dirname, `../files/convocatoria/${id}`)}`;

        if( !fs.existsSync(ruta) ){
            fs.mkdirSync(ruta);
        }

        if( files ) {
            let file_adjuntos = files.adjuntos as Array<any>;
            
            if( !Array.isArray(file_adjuntos) ) {
                const aux = file_adjuntos;
                file_adjuntos = [];
                file_adjuntos[0] = aux;
            }
            archivos = adjuntos(file_adjuntos, Number(id), true);

            emailConfig = {
                ...emailConfig,
                attachments: archivos
            }



            if ( archivos.length > 0 ){
                archivos.forEach( async({ filename }:{filename:string}) => {
                    const sqldelete = `delete from AdjuntoConvocatoria where nombre=?`;
                    const sql = `insert into AdjuntoConvocatoria(convocatoria, nombre) values(?,?);`;
                    await db.execute(sqldelete,[filename]);
                    await db.execute(sql,[id,filename]);
                });               
            }

        }else {
            let dir = fs.readdirSync(ruta);
            
            for (const i in dir) {
                archivos.push({
                    filename: dir[i],
                    content: fs.readFileSync(`${ruta}/${dir[i]}`)
                })
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

}

export const files = (req:Request, res: Response) => {
    const { id,filename } = req.params;

    const path = resolve(__dirname, `../files/${id}/${filename}`)

    if( fs.existsSync(path) ){
        return res.sendFile(path);
    }else {
        return res.json({
            ok: false,
            msg: 'no existen archivos para esta convocatoria'
        })
    }
}

export const deleteAdjunto = async (req:Request, res: Response) => {
    const { id,filename } = req.params;

    const path = resolve(__dirname, `../files/${id}`);

    if( fs.existsSync(`${path}/${filename}`) ){
        fs.unlinkSync( `${path}/${filename}` );

        if( fs.readdirSync(path).length <= 0 ){
            fs.rmdirSync(path);
        }

        const sql = `delete from AdjuntoConvocatoria where convocatoria=? and nombre=?;`;

        await db.execute(sql, [id, filename]);

        return res.json({
            ok: true,
            msg: `Archivo ${ filename } eliminado del servidor correctamente`
        })
    }else {
        return res.json({
            ok: false,
            msg: 'no existen archivos para esta convocatoria'
        })
    }
}
