import express, { Application } from 'express';

export default abstract class server<F> {
    private readonly app:Application;
    private port:number;
    private readonly name:string;

    constructor( port:number, name:string ) {
        this.app = express();
        this.port = port;
        this.name = name;
    }

    abstract listenServer(x:F):any

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