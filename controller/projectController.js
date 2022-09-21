import mongoose from "mongoose";
import Project from "../models/Project.js";
import User from "../models/User.js";

const getProjects = async (req, res) => {
  const projects = await Project.find()
    .where("creator")
    .equals(req.user)
    .select("-tasks");
  res.json(projects);
};

const newProject = async (req, res) => {
  const project = new Project(req.body);
  project.creator = req.user._id;

  try {
    const saveProject = await project.save();
    res.json(saveProject);
  } catch (error) {
    console.log(error);
  }
};

const getProject = async (req, res) => {
  const { id } = req.params;
  const project = await Project.findById(id)
    .populate("tasks")
    .populate("collaborators", "name email");

  if (project.creator.toString() !== req.user._id.toString()) {
    const error = new Error("Project no found!!");
    return res.status(401).json({
      msg: error.message,
    });
  }

  res.json(project);
};

const editProject = async (req, res) => {
  const { id } = req.params;
  const project = await Project.findById(id);

  if (project.creator.toString() !== req.user._id.toString()) {
    const error = new Error("Access denied");
    return res.status(403).json({
      msg: error.message,
    });
  }
  project.name = req.body.name || project.name;
  project.description = req.body.description || project.description;
  project.deliveryDate = req.body.deliveryDate || project.deliveryDate;
  project.client = req.body.client || project.client;

  try {
    const projectUpdate = await project.save();
    res.status(200).json({
      msg: "The project has been update correctly",
      projectUpdate,
    });
  } catch (error) {
    console.log(error);
  }
};

const deleteProject = async (req, res) => {
  const { id } = req.params;
  const project = await Project.findById(id);

  if (project.creator.toString() !== req.user._id.toString()) {
    const error = new Error("Access denied");
    return res.status(403).json({
      msg: error.message,
    });
  }

  try {
    await project.deleteOne();
    res.status(200).json({
      msg: "The project has been delete correctly!!",
    });
  } catch (error) {
    console.log(error);
  }
};

const findCollaborator = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email }).select(
    "-createdAt -updatedAt -password -token -confirmed -__v"
  );

  if (!user) {
    const error = new Error("User does not exist");
    return res.status(404).json({ msg: error.message });
  }
  res.json(user);
};

const addCollaborator = async (req, res) => {
  const { email } = req.body;
  const project = await Project.findById(req.params.id);
  if (!project) {
    const error = new Error("Project Not Found");
    return res.status(404).json({ msg: error.message });
  }

  if (project.creator.toString() !== req.user._id.toString()) {
    const error = new Error("Invalid Action");
    return res.status(404).json({ msg: error.message });
  }

  const user = await User.findOne({ email }).select(
    "-createdAt -updatedAt -password -token -confirmed -__v"
  );

  if (!user) {
    const error = new Error("User does not exist");
    return res.status(404).json({ msg: error.message });
  }

  if (project.creator.toString() === user._id.toString()) {
    const error = new Error("Invalid Action");
    return res.status(400).json({ msg: error.message });
  }

  if (project.collaborators.includes(user._id)) {
    const error = new Error("User has already been added");
    return res.status(400).json({ msg: error.message });
  }

  project.collaborators.push(user._id);
  await project.save();
  res.json({ msg: "User has been added correctly" });
};

const removeCollaboratos = async (req, res) => {};

export {
  getProjects,
  newProject,
  getProject,
  editProject,
  deleteProject,
  findCollaborator,
  addCollaborator,
  removeCollaboratos,
};
