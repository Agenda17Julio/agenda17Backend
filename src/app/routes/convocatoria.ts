import { Router } from "express";
import { verifyToken } from '@middlewares/jwt';
import { sendMail,getAllAnnoucements, getActiveAnnoucements } from '@services/convocatoria';

export default class ConvocatoriaRoutes {
    
    private route:Router;

    private constructor() {
        this.route = Router();
        this.init();
    }

    public static init(){
        return new ConvocatoriaRoutes();
    }

    private Middlewares(){
        this.route.use(verifyToken);
    }

    private Routes( path:string ) {
        return this.Route.route(`/convocatoria${path}`)
    }

    private init() {
        this.Middlewares();
        this.Routes('/mail')
            .post( sendMail );


        this.Routes('/annoucements/:pagina')
            .get( getAllAnnoucements )

        this.Routes('/allannoucements/active')
            .get( getActiveAnnoucements )
    }

    get Route(){
        return this.route;
    }
}