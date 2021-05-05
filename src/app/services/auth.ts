import { Request as X, Response as R} from 'express';

export default class AuthService {

    constructor () { }

    public createUser(req:X, res:R) {
        res.json({
            ok: true
        })
    }

    public updateUser(req:X, res:R){

    }

    public deleteUser(req:X, res:R){

    }

    public getAllUsers(req:X, res:R) {

    }

    public getUserById(req:X, res:R){

    }

    public login(req:X, res:R) {

    }

    public refreshToken(req:X, res:R) {

    }
}