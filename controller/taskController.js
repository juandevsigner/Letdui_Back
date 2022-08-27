import Task from "../models/Task.js";
import Project from "../models/Project.js";

const createTasks = async (req, res) => {
  const { project } = req.body;

  const existProject = await Project.findById(project);

  if (existProject.creator.toString() !== req.user._id.toString()) {
    const error = new Error("Acces denied");
    return res.status(403).json({ msg: error.message });
  }

  try {
    const taskSave = await Task.create(req.body);
    res.status(200).json({
      msg: "The task has been created correctly",
      taskSave,
    });
  } catch (error) {
    console.log(error);
  }
};

const getTask = async (req, res) => {
  const { id } = req.params;
  const task = await Task.findById(id).populate("project");

  if (task.project.creator.toString() !== req.user._id.toString()) {
    const error = new Error("Acces denied");
    return res.status(403).json({ msg: error.message });
  }

  res.status(201).json(task);
};

const updateTask = async (req, res) => {
  const { id } = req.params;
  const task = await Task.findById(id).populate("project");

  if (task.project.creator.toString() !== req.user._id.toString()) {
    const error = new Error("Acces denied");
    return res.status(403).json({ msg: error.message });
  }

  task.name = req.body.name || task.name;
  task.description = req.body.description || task.description;
  task.priority = req.body.priority || task.priority;
  task.state = req.body.state || task.state;
  task.deliveryDate = req.body.deliveryDate || task.deliveryDate;

  try {
    const taskSave = await task.save();

    res.json({ msg: "The task has been update correctly", taskSave });
  } catch (error) {
    console.log(error);
  }
};

const removeTask = async (req, res) => {
  const { id } = req.params;
  const task = await Task.findById(id).populate("project");

  if (task.project.creator.toString() !== req.user._id.toString()) {
    const error = new Error("Acces denied");
    return res.status(403).json({ msg: error.message });
  }

  try {
    await task.deleteOne();
    res.status(200).json({
      msg: "The task has been delete correctly!!",
    });
  } catch (error) {
    console.log(error);
  }
};

const changeState = async (req, res) => {};

export { createTasks, getTask, removeTask, updateTask, changeState };
