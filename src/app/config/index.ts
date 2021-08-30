import { config } from 'dotenv';
import { envtype } from '&interface/config';

config({ path:'.env' });
const { NODE_ENV } = process.env;
const env:envtype = NODE_ENV as envtype;


switch( env ) {
    case 'development' : config({ path:`.env.${env}` }); break;
    case 'production' : config({ path:`.env.${env}` }); break;
    case 'testing' : config({ path:`.env.${env}` }); break;
    default: 
        throw new Error('Ambiente inválido!')
}