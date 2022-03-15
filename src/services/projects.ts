import Projects from "../models/Projects";

export async function getAllProjects() {
  try {
    return await Projects.find({});
  } catch (error) {
    throw new Error(error);
  }
}
