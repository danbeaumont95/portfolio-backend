import mongoose from "mongoose";

export interface ProjectsDocument extends mongoose.Document {
  name: string;
  createdAt: Date;
  description: string;
  languages: Array<string>;
  fullStack: boolean;
  image: string;
  link: string;
}

const ProjectsSchema = new mongoose.Schema({
  name: { type: String, default: '', required: true },
  description: { type: String, default: '', required: true },
  languages: { type: Array, default: [], required: true },
  fullStack: { type: Boolean, default: false },
  image: { type: String, default: '' },
  link: { type: String, default: '' }
}, {
  timestamps: true,
});

const Projects = mongoose.model<ProjectsDocument>('Projects', ProjectsSchema);

export default Projects;
