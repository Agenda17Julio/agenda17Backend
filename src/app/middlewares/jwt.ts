import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

export const verifyToken = async ( req:Request,res:Response,next:NextFunction ) => {
    try {

        const token = req.header('X-Token') as string;

        if( !token ) res.status( 404 ).json({
            ok: false,
            msg: 'No existe el token en la petición'
        });


        const  { SECRECT_JWT_SEED:seed } = process.env;

        verify(token, String(seed), ( err, payload ) => {
            if( err ) res.status(400).json({
                ok: false,
                msg: 'Token no válido'
            });

            req.body.payload = payload;

            return next();
        })
        
    } catch ( err ) {
        return res.status(500).json({
            ok: false,
            msg: 'Error interno, por favor contacta con un administrador',
            err
        })
    }
}