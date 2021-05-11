import express, { Application,json,urlencoded } from 'express';

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
    }

    private Parser() {
        this.app.use( json() );
        this.app.use( urlencoded({extended:true}) );
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