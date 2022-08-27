import { Router } from "express";
import {
  createUsers,
  deleteUsers,
  auth,
  confirm,
  recoverPassword,
  checkToken,
  newPassword,
  profile,
} from "../controller/usersController.js";
import checkAuth from "../middleware/checkAuth.js";

const router = Router();
router.post("/", createUsers);
router.delete("/:id", deleteUsers);
router.post("/login", auth);
router.get("/confirm/:token", confirm);
router.post("/recover-password", recoverPassword);
router.route("/recover-password/:token").get(checkToken).post(newPassword);
router.get("/profile", checkAuth, profile);

export default router;
