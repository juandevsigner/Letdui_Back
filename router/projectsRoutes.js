import { Router } from "express";
import checkIdMongo from "../middleware/checkIdMongo.js";
import {
  getProjects,
  getProject,
  deleteProject,
  editProject,
  newProject,
  findCollaborator,
  addCollaborator,
  removeCollaboratos,
} from "../controller/projectController.js";
import checkAuth from "../middleware/checkAuth.js";

const router = Router();

router.route("/").get(checkAuth, getProjects).post(checkAuth, newProject);
router
  .route("/:id")
  .get(checkAuth, checkIdMongo, getProject)
  .put(checkAuth, checkIdMongo, editProject)
  .delete(checkAuth, checkIdMongo, deleteProject);

router.post("/team", findCollaborator);
router.post("/team/:id", checkAuth, addCollaborator);
router.delete("/team/:id", checkAuth, removeCollaboratos);

export default router;
