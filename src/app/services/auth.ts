import { Request as X, Response as R} from 'express';
import { generarToken } from '@helpers/jwt';
import { i_user } from '@interface/auth';
import { i_jwt } from '@interface/jwt';
import Database from '@database/index';
const db = Database.init().connection;


export const login = async (req:X, res:R) =>  {

    const { username:u, password } = req.body as i_user;
    const sql = `select u.id, u.username,p.correo, u.rol
        from Usuario u
        inner join Persona p
        on u.persona = p.id 
        where u.password = ?
        and (
            u.username = ?
            or p.correo = ?
            or p.cedula = ?
        );`

    const [ data ] = await db.execute(sql,[ password, u, u, u ]);
    const info:any = data;

    if( !data || info.length < 1 ) return res.status(403).json({
        ok: false,
        msg: 'credenciales invalidas'
    });


    const dataToken:i_jwt = { uid:info[0].id, username:info[0].username, email: info[0].correo, rol: info[0].rol  };
    const token = generarToken( dataToken );

    return res.json({
        ok: true,
        token
    });
}


export const refreshToken = (req:X, res:R) =>  {
    const data = req.body.payload;

    const token = generarToken(data.payload);

    return res.json({
        ok: true,
        token
    })
}