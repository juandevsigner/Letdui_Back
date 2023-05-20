import express from "express";
import dotenv from "dotenv";
import conectDb from "./config/db.js";
import userRoutes from "./router/usersRoutes.js";
import projectsRoutes from "./router/projectsRoutes.js";
import taskRoutes from "./router/taskRoutes.js";
import cors from "cors";
import { Server } from "socket.io";

const app = express();
app.use(express.json());
dotenv.config();
conectDb();

app.use(cors({
  origin: process.env.FRONTEND_URL
}));

app.use("/api/users", userRoutes);
app.use("/api/projects", projectsRoutes);
app.use("/api/task", taskRoutes);

const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, () => {
  console.log("**SERVER RUN IN PORT**", PORT);
});

// SOCKETS
const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.FRONTEND_URL,
  },
});

io.on("connection", socket => {
  console.log("---Socket ONLINE---");
  //Events

  socket.on("open project", project => {
    socket.join(project);
  });

  socket.on("new task", task => {
    const project = task.project;
    socket.to(project).emit("task add", task);
  });

  socket.on("remove task", task => {
    const project = task.project;
    socket.to(project).emit("task deleted", task);
  });

  socket.on("update task", task => {
    const project = task.project._id;
    socket.to(project).emit("up task", task);
  });

  socket.on("change state", task => {
    const project = task.project._id;
    socket.to(project).emit("new state", task);
  });
});
