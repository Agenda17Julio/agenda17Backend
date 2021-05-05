import { config } from 'dotenv';
import { envtype } from '@interface/config';

config({ path:'.env' });
const { NODE_ENV } = process.env;
const env:envtype = NODE_ENV as envtype;


if( !env ) {
    throw new Error('Configure environment in the file .env please!')
} else if( env.includes('development' || 'production' || 'testing') ){
    config({ path:`.env.${env}` });
} else {
    throw new Error('The environment is invalid!')
}