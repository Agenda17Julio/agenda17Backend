import { Request, Response } from 'express';
import { i_email } from '@interface/mail';
import { adjuntos } from '@helpers/adjuntos';
import Email from '@mail/index';
import fileUpload from 'express-fileupload';


const email = Email.init();


export const sendMail = (req:Request,res:Response) => {

    const files = req.files as fileUpload.FileArray;
    const file_adjuntos = files.adjuntos as Array<any>;

    let emailConfig:i_email = {
        from: {
            name: "juan",
            address: "juan@gmail.com"
        },
        to: [
            "pepe.37285@gmail.com"
        ],
        subject: "Mensaje de prueba",
        html: "<h1> Hola mundo <h1/>"
    }

    if( file_adjuntos ) emailConfig = {
        ...emailConfig,
        attachments: adjuntos(file_adjuntos)
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
}