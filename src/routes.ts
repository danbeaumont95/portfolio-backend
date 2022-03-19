import { getAllProjectsHandler, postNewProjectHandler } from './controllers/projects';
import { Express } from 'express';
import { sendEmailHandler } from './controllers/contact';

export default function app(app: Express) {
  app.get('/api/', getAllProjectsHandler);
  app.post('/api/', postNewProjectHandler);

  app.post('/api/contact', sendEmailHandler);
}
