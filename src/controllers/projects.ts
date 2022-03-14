import { Request, Response } from "express";
import { getAllProjects, postNewProject } from "../services/projects";

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
    console.log(allProjects, 'all projects');
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
    const { body } = req;
    const project = await postNewProject(body);
  } catch (error) {
    console.error(error);
    return res.status(400).send(error.message);
  }
  return res.status(200).json(respBody);
};
