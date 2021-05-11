import { check } from 'express-validator';
import types from './types';


export const emailVal = () => {
    const { field,msg } = types.email;

    return check( field,msg )
        .isEmail()
        .not().isEmpty()
        .normalizeEmail()
}


export const passwordVal = () => {
    const { field,msg } = types.password;

    return check( field,msg)
        .not().isEmpty()
        .isString()
}

export const usernameVal = () => {
    const { field,msg } = types.username;

    return check( field, msg )
        .not().isEmpty()
        .isString()
}