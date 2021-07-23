import { Router } from "express";
import { verifyToken } from '@middlewares/jwt';
import { addNewActa,
    getAllAdjuntosActa,
    getAllActas,
    getAdjunto,
    deleteAdjunto,
    getAnnoucementsActas,
    updateActa,
    deleteActa
} from '@services/actas';

export default class ActaasRoutes {
    
    private route:Router;

    private constructor() {
        this.route = Router();
        this.init();
    }

    public static init(){
        return new ActaasRoutes();
    }

    private Middlewares(){
        this.route.use(verifyToken);
    }

    private Routes( path:string ) {
        return this.Route.route(`/actas${path}`)
    }

    private init() {
        this.Middlewares();
        this.Routes('/add')
            .post( addNewActa );
        
        this.Routes('/conv/:pagina')
            .get( getAllActas );

        this.Routes('/delete/:id_acta')
            .delete( deleteActa );

        this.Routes('/annoucement')
            .get( getAnnoucementsActas );

        this.Routes('/adjuntos/:id_acta')
            .get( getAllAdjuntosActa )
            .put( updateActa );

        this.Routes('/adjuntos/:id_acta/:filename')
            .get( getAdjunto )
            .delete( deleteAdjunto );
    }

    get Route(){
        return this.route;
    }
}