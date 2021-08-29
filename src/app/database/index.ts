import { createPool,Pool,PoolOptions} from 'mysql2/promise';
import { config } from '&config/db';

export default class Database {

    private static instance:Database;
    private readonly opts:PoolOptions;
    private connect:Pool;
    
    private constructor () {
        this.opts = config;
        this.connect = createPool( this.opts );
    }

    public static init(){
        if( !this.instance ) {
            this.instance = new Database();
        }
        return this.instance;
    }

    get connection() {
        return this.connect;
    }

}