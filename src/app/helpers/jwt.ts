import { i_jwt } from '@interface/jwt';
import { sign } from 'jsonwebtoken';

export const generarToken = (payload: i_jwt) => {
       
    const { SECRECT_JWT_SEED:seed } = process.env;

    const token = sign({ payload },String(seed),{
        expiresIn: '2h'
    });

    return token;
        
}