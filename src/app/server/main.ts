import Server from '@server/index';
import endPoint from '@routes/index';

export default class MainServer extends Server<Function> {
    
    public static instance: MainServer;

    private constructor(port:number, name:string){
        super(port,name);
        this.init();
    }

    public static init(port:number,name:string) {
        return this.instance = new MainServer(port,name);
    }

    private init(){
        this.Routes();
    }

    private Routes(){
        return this.getApp.use('/api/v1',endPoint);
    }

    public listenServer(Callback:Function) {
        return this.getApp.listen( this.getPort, Callback() );
    }
}