import { Meta } from 'express-validator';
import moment from 'moment';

export default (value:string,{ req,location,path }:Meta) => {
    return moment( value ).isValid();
}