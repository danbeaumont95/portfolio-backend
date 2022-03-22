"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ProjectsSchema = new mongoose_1.default.Schema({
    name: { type: String, default: '', required: true },
    description: { type: String, default: '', required: true },
    languages: { type: Array, default: [], required: true },
    fullStack: { type: Boolean, default: false },
    image: { type: String, default: '' },
    link: { type: String, default: '' },
    source: { type: String, default: '' },
}, {
    timestamps: true,
});
const Projects = mongoose_1.default.model('Projects', ProjectsSchema);
exports.default = Projects;
