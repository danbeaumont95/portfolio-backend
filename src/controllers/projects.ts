import { Request, Response } from "express";
import { getAllProjects } from "../services/projects";
import aws from 'aws-sdk';
import multiparty from 'multiparty';
import Projects from '../models/Projects';
import fs from 'fs';

const S3_BUCKET_NAME: string = (process.env.S3_BUCKET_NAME as string);
const S3_REGION: string = (process.env.S3_REGION as string);
const AWS_ACCESS_KEY_ID: string = (process.env.AWS_ACCESS_KEY_ID as string);
const AWS_SECRET_ACCESS_KEY: string = (process.env.AWS_SECRET_ACCESS_KEY as string);
const S3_ACCESS_KEY: string = (process.env.S3_ACCESS_KEY as string);
const S3_ACCESS_SECRET: string = (process.env.S3_ACCESS_SECRET as string);

const s3 = new aws.S3({
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

export async function getAllProjectsHandler(req: Request, res: Response) {
  const respBody = {
    success: false,
    message: '',
    data: {}
  };
  try {
    const allProjects = await getAllProjects();
    if (!allProjects) {
      respBody.message = '[BadRequest] Unable to find projects';
      return res.status(200).json(respBody);
    }

    respBody.success = true;
    respBody.data = allProjects;

  } catch (error) {
    console.error(error);
    return res.status(400).send(error.message);
  }
  return res.status(200).json(respBody);
};

export async function postNewProjectHandler(req: Request, res: Response) {
  const respBody = {
    success: false,
    message: '',
    data: {}
  };
  try {
    const form = new multiparty.Form();
    form.parse(req, async (error, fields, files) => {
      const {
        name,
        description,
        languages,
        fullStack,
        link
      } = fields;
      if (!name || !description || !languages || !fullStack || !link) {
        throw new Error('[BadRequest] Missing information');
      }
      const projectName = name[0];
      const projectDescription = description[0];
      const projectLanguages = JSON.parse(languages[0]);
      const projectFullStack = JSON.parse(fullStack[0]);
      const projectLink = link[0];

      const newProject = await Projects.create({
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

      const buffer = fs.readFileSync(path);

      const fileName = `papers/${projectName}/${_id}`;

      const data = await upload(buffer, fileName);

      const updatedProject = await Projects.findByIdAndUpdate(_id, {
        $set: {
          image: data.Location
        }
      }, {
        new: true
      }).lean();

      respBody.success = true;
      respBody.data = updatedProject;
      return res.status(200).json(respBody);

    });
  } catch (error) {
    console.error(error);
    return res.status(400).send(error.message);
  }
};
