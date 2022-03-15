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

/*
const postPapersHandler = async (req, res) => {
  const respBody = {
    success: false,
    message: '',
    data: {},
  };
  try {
    const form = new multiparty.Form();
    form.parse(req, async (error, fields, files) => {
      const { title, body, dateCreated } = fields;
      const newPaperTitle = title[0];
      const newPaperBody = body[0];
      const dateWrote = dateCreated[0];
      const formattedDate = moment(dateWrote).format('YYYY-MM-DD[T]HH:mm:ss');

      if (!title) {
        throw new Error('[BadRequest] Paper needs a title');
      }
      const newPaper = await Papers.create({
        title: newPaperTitle, body: newPaperBody, dateWrote: formattedDate,
      });
      const { _id } = newPaper;
      if (error) {
        throw new Error(error);
      }

      if (!files.file) {
        respBody.success = true;
        respBody.data = newPaper;
        return res.status(200).json(respBody);
      }
      const { path } = files.file[0];

      const buffer = fs.readFileSync(path);

      const fileName = `papers/${newPaperTitle}/${_id}/${newPaperTitle}`;

      const data = await upload(buffer, fileName);

      const updatedPaper = await Papers.findByIdAndUpdate(_id, {
        $set: {
          link: data.Location,
        },
      }, {
        new: true,
      }).lean();

      respBody.success = true;
      respBody.data = updatedPaper;
      return res.status(200).json(respBody);
    });
  } catch (error) {
    respBody.message = error;
    return res.status(400).json(respBody);
  }
};
*/
