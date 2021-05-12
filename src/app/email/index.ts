import { createTransport } from 'nodemailer';
import { transportConfig } from '@config/mail';
import { i_email } from '@interface/mail';


export default class EMail {

    private transporterConfig:any;
    private static instance:EMail;

    private constructor (){
        this.transporterConfig = transportConfig;
    }

    static init(){
        if( !EMail.instance ){
            EMail.instance = new EMail();
        }
        return EMail.instance;
    }

    get Transporter (){
        return createTransport( this.transporterConfig );
    }

    public sendMail ( optsMail:i_email,Callback:Function ) {
        return this.Transporter.sendMail( optsMail,Callback() )
    }
}