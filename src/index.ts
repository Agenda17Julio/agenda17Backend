'use strict';
import '@config/index';
import Database from '@database/index';
import MainServer from '@server/main';
import Mail from '@mail/index';

const database = Database.init().connection;

database.getConnection()
  .then(() => console.log('database online'))
  .then(async () => {
    const { PORT, APP_NAME } = process.env;
    
    const server = MainServer.init(Number(PORT),String(APP_NAME));
    server.listenServer(() => console.log(`listening app ${server.getName} on port ${server.getPort}`));

    const mail = Mail.init();
    await mail.Transporter.verify(() => console.log('Servicio de correos Activo!!'))
  })
  .catch((err:any) => { throw err });
