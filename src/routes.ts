import { getAllProjectsHandler, postNewProjectHandler } from './controllers/projects';
import { Express } from 'express';

export default function app(app: Express) {
  app.get('/', getAllProjectsHandler);
  app.post('/', postNewProjectHandler);
}
