import Projects, { ProjectsDocument } from "../models/Projects";
import {
  DocumentDefinition,
} from 'mongoose';

export async function getAllProjects() {
  try {
    return await Projects.find({});
  } catch (error) {
    throw new Error(error);
  }
}

export async function postNewProject(input: DocumentDefinition<ProjectsDocument>) {
  try {
    console.log(input, 'input in service');
    const project = await Projects.create(input);
    console.log(project, 'project');
    return project;
  } catch (error) {
    throw new Error(error);
  }
}
