import { getAllProjectsHandler, postNewProjectHandler } from './controllers/projects';
import { Express } from 'express';

export default function app(app: Express) {
  app.get('/api/', getAllProjectsHandler);
  app.post('/api/', postNewProjectHandler);
}
