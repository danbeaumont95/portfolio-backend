"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postNewProjectHandler = exports.getAllProjectsHandler = void 0;
const projects_1 = require("../services/projects");
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const multiparty_1 = __importDefault(require("multiparty"));
const Projects_1 = __importDefault(require("../models/Projects"));
const fs_1 = __importDefault(require("fs"));
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;
const S3_REGION = process.env.S3_REGION;
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const S3_ACCESS_KEY = process.env.S3_ACCESS_KEY;
const S3_ACCESS_SECRET = process.env.S3_ACCESS_SECRET;
const s3 = new aws_sdk_1.default.S3({
    accessKeyId: S3_ACCESS_KEY,
    secretAccessKey: S3_ACCESS_SECRET,
    region: S3_REGION,
});
const upload = (buffer, name) => {
    const params = {
        ACL: 'public-read',
        Body: buffer,
        Bucket: S3_BUCKET_NAME,
        Key: `${name}`,
    };
    return s3.upload(params).promise();
};
const generateSuffix = (type) => {
    switch (type) {
        case 'image/jpeg':
            return 'jpg';
        case 'image/png':
            return 'png';
        default:
            return '';
    }
};
function getAllProjectsHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const respBody = {
            success: false,
            message: '',
            data: {}
        };
        try {
            const allProjects = yield (0, projects_1.getAllProjects)();
            if (!allProjects) {
                respBody.message = '[BadRequest] Unable to find projects';
                return res.status(200).json(respBody);
            }
            respBody.success = true;
            respBody.data = allProjects;
        }
        catch (error) {
            console.error(error);
            return res.status(400).send(error.message);
        }
        return res.status(200).json(respBody);
    });
}
exports.getAllProjectsHandler = getAllProjectsHandler;
;
function postNewProjectHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const respBody = {
            success: false,
            message: '',
            data: {}
        };
        try {
            const form = new multiparty_1.default.Form();
            form.parse(req, (error, fields, files) => __awaiter(this, void 0, void 0, function* () {
                const { name, description, languages, fullStack, link } = fields;
                if (!name || !description || !languages || !fullStack || !link) {
                    throw new Error('[BadRequest] Missing information');
                }
                const projectName = name[0];
                const projectDescription = description[0];
                const projectLanguages = JSON.parse(languages[0]);
                const projectFullStack = JSON.parse(fullStack[0]);
                const projectLink = link[0];
                const newProject = yield Projects_1.default.create({
                    name: projectName,
                    description: projectDescription,
                    languages: projectLanguages,
                    fullStack: projectFullStack,
                    link: projectLink
                });
                const { _id } = newProject;
                if (error) {
                    throw new Error(`${error}`);
                }
                if (!files.file) {
                    respBody.success = true;
                    respBody.data = newProject;
                    return res.status(200).json(respBody);
                }
                const { path } = files.file[0];
                const buffer = fs_1.default.readFileSync(path);
                const fileName = `papers/${projectName}/${_id}`;
                const data = yield upload(buffer, fileName);
                const updatedProject = yield Projects_1.default.findByIdAndUpdate(_id, {
                    $set: {
                        image: data.Location
                    }
                }, {
                    new: true
                }).lean();
                respBody.success = true;
                respBody.data = updatedProject;
                return res.status(200).json(respBody);
            }));
        }
        catch (error) {
            console.error(error);
            return res.status(400).send(error.message);
        }
    });
}
exports.postNewProjectHandler = postNewProjectHandler;
;
