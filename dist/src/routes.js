"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const projects_1 = require("./controllers/projects");
function app(app) {
    app.get('/', projects_1.getAllProjectsHandler);
}
exports.default = app;
