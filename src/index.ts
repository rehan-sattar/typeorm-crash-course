import 'reflect-metadata';
import express from 'express';
import { DataSource } from 'typeorm';

import {
  connectBankerAndClient,
  createBanker,
  createClient,
  createTransaction,
  deleteClient
} from './controllers';
import { Banker } from './entities/banker';
import { Client } from './entities/client';
import { Transactions } from './entities/transaction';

const app = express();

const main = async () => {
  const PostgresDataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'USERNAME_HERE',
    password: 'PASSWORD_HERE',
    database: 'DATABASE_NAME_HERE',
    entities: [Client, Banker, Transactions],
    synchronize: true
  });

  try {
    PostgresDataSource.initialize();
    console.log('Data Source "Postgres" has been initialized.');

    app.use(express.json());

    app.post('/api/client', createClient);
    app.post('/api/banker', createBanker);
    app.post('/api/client/:clientId/transaction', createTransaction);
    app.post('/api/client/:clientId/banker/:bankerId', connectBankerAndClient);

    app.delete('/api/client/:clientId', deleteClient);

    app.listen(8080, () => {
      console.log('Server running on port 8080');
    });
  } catch (err) {
    console.log('Error while loading the data source.');
    console.error(err);
  }
};

main();
