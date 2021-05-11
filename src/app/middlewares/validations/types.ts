import { i_valid_types,type } from '@interface/valid_types';

const types:i_valid_types<type> = {
    email: {
        field: 'email',
        msg: 'El email es necesario!'
    },
    password: {
        field: 'password',
        msg: 'El password es necesario!'
    },
    username: {
        field: 'username',
        msg: 'Por favor ingresa un username!'
    }
}


export default types;