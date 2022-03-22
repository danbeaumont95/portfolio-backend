"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const projects_1 = require("./controllers/projects");
const contact_1 = require("./controllers/contact");
function app(app) {
    app.get('/api/', projects_1.getAllProjectsHandler);
    app.post('/api/', projects_1.postNewProjectHandler);
    app.post('/api/contact', contact_1.sendEmailHandler);
}
exports.default = app;
