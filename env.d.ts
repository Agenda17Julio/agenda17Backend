declare namespace NodeJs {
    export interface ProcessEnv {
        NODE_ENV: string;
        APP_NAME: string;
        PORT: string;
        DB_HOST: string;
        DB_USER: string;
        DB_PASSWORD: string;
        DB_NAME: string;
        DB_PORT: number;
        DB_URL: string;
        SECRECT_JWT_SEED:string;
    }
}