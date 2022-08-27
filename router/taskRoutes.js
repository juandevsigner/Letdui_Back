import { Router } from "express";
import checkIdMongo from "../middleware/checkIdMongo.js";
import {
  createTasks,
  getTask,
  removeTask,
  updateTask,
  changeState,
} from "../controller/taskController.js";
import checkAuth from "../middleware/checkAuth.js";

const router = Router();

router.post("/", checkAuth, createTasks);
router
  .route("/:id")
  .get(checkAuth, checkIdMongo, getTask)
  .put(checkAuth, checkIdMongo, updateTask)
  .delete(checkAuth, checkIdMongo, removeTask);

router.post("/state/:id", checkAuth, changeState);

export default router;
