import express from 'express';
console.log(__dirname, '__dirname');
// require('dotenv').config({ path: __dirname + '../.env' });
require('dotenv').config();
import cors from 'cors';
import mongoose, { ConnectOptions } from 'mongoose';

import routes from './routes';
const router = express.Router();

const allowedOrigins = ['http://localhost:3001'];

const dbUri: string = (process.env.dbUri as string);

const port = process.env.PORT || 1337;

const options: cors.CorsOptions = {
  origin: allowedOrigins
};

mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true, } as ConnectOptions)
  .then(() => {
    const app = express();
    app.use(cors(options));

    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use('/api', router);
    app.get('/info', async (req, res) => {
      res.send({ name: 'Portfolio API', version: '0.0.1 BETA' });
    });
    app.listen(port, () => {
      console.log(`Server listening at ${port}`);
    });
    routes(app);
  });
