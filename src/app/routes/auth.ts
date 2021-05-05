import { Router } from 'express';
import AuthService from '@services/auth';

export default class AuthRoutes {
    
    private static instance:AuthRoutes;
    private route:Router;
    private readonly service:AuthService;

    private constructor() {
        this.route = Router();
        this.service = new AuthService();
        this.init();
    }

    public static init(){
        return this.instance = new AuthRoutes();
    }

    private Routes( path:string ) {
        return this.Route.route(`/auth${path}`)

    }

    private init() {
        this.Routes('/user')
            .post( this.service.createUser )
            .get( this.service.getAllUsers )
            

        this.Routes('/user/:id')
            .put( this.service.updateUser )
            .delete( this.service.deleteUser )
            .get( this.service.getUserById );

        this.Routes('/login')
            .get( this.service.login )
            .put( this.service.refreshToken );
    }

    get Route(){
        return this.route;
    }
}