import express, { Application,json,urlencoded } from 'express';
import fileUpload from 'express-fileupload';
import cors from 'cors';

export default abstract class server<F> {
    private readonly app:Application;
    private port:number;
    private readonly name:string;

    constructor( port:number, name:string ) {
        this.app = express();
        this.port = port;
        this.name = name;
        this.OnInit();
    }

    abstract listenServer(x:F):any;

    private OnInit(){
        this.Parser();
        this.FileUpload();
        this.Cors();
    }

    private Parser() {
        this.app.use( json() );
        this.app.use( urlencoded({extended:true}) );
    }

    private FileUpload(){
        this.app.use(fileUpload())
    }

    private Cors() {
        this.app.use(cors({
            origin: [
                'http://localhost:3000'
            ]
        }))
    }

    get getName(){
        return this.name;
    }

    get getPort() {
        return this.port;
    }   

    get getApp() {
        return this.app
    }
}