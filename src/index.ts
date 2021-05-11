import '@config/index';
import Database from '@database/index';
import MainServer from '@server/main';

const database = Database.init().connection;

database.getConnection()
  .then(() => console.log('database online'))
  .then(() => {
    const { PORT, APP_NAME } = process.env;
    
    const server = MainServer.init(Number(PORT),String(APP_NAME));
    server.listenServer(() => console.log(`listening app ${server.getName} on port ${server.getPort}`))
  })
  .catch((err:any) => { throw err });