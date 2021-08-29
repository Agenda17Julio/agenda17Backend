import { Router } from 'express';
import { login,refreshToken } from '&services/auth';
import { verifyToken } from '&middlewares/jwt';
import AuthVal from '&middlewares/validations/auth';
import isVal from '&middlewares/validations/isVal';

export default class AuthRoutes {
    
    private static instance:AuthRoutes;
    private route:Router;

    private constructor() {
        this.route = Router();
        this.init();
    }

    public static init(){
        return this.instance = new AuthRoutes();
    }

    private Routes( path:string ) {
        return this.Route.route(`/auth${path}`)
    }

    private init() {
        this.Routes('/login')
            .post( [...AuthVal(),isVal],login );

        this.Routes('/refreshtoken')
            .get( verifyToken,refreshToken );
    }

    get Route(){
        return this.route;
    }
}