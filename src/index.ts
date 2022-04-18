import express, {Application} from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

import dbConnection from './db/config';
import authRoutes from './routes/authRoutes';

class Server
{
  public app: Application;
  constructor()
  {
    dotenv.config();
    this.app = express();
    dbConnection();
    this.config();
    this.routes();
  }

  config():void
  {
    this.app.set('port', process.env.PORT || 3000);
    this.app.use(morgan('dev'));
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({extended:false}));
  }

  routes():void
  {
    this.app.use('/api/auth',authRoutes);
  }

  start():void
  {
    this.app.listen(this.app.get('port'), ()=>
    {
        console.log('Servidor corriendo en puerto', this.app.get('port'));
    })
  }

}

const server:Server = new Server();
server.start();
