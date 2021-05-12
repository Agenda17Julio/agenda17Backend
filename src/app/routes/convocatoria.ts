import { Router } from "express";
import { sendMail } from '@services/convocatoria';

export default class ConvocatoriaRoutes {
    
    private route:Router;

    private constructor() {
        this.route = Router();
        this.init();
    }

    public static init(){
        return new ConvocatoriaRoutes();
    }

    private Routes( path:string ) {
        return this.Route.route(`/convocatoria${path}`)
    }

    private init() {
        this.Routes('/mail')
            .post( sendMail );
    }

    get Route(){
        return this.route;
    }
}