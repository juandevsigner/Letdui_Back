import express from "express";
import dotenv from "dotenv";
import conectDb from "./config/db.js";
import userRoutes from "./router/usersRoutes.js";
import projectsRoutes from "./router/projectsRoutes.js";
import taskRoutes from "./router/taskRoutes.js";

const app = express();
app.use(express.json());
dotenv.config();
conectDb();

app.use("/api/users", userRoutes);
app.use("/api/projects", projectsRoutes);
app.use("/api/task", taskRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log("**SERVER RUN IN PORT**", PORT);
});
