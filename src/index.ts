import '@config/index';
import MainServer from '@server/main';


const { PORT, APP_NAME } = process.env;

const server = MainServer.init(Number(PORT),String(APP_NAME));
server.listenServer(() => console.log(`listening app ${server.getName} on port ${server.getPort}`))