import express from "express";
import dotenv from "dotenv";
import conectDb from "./config/db.js";
import userRoutes from "./router/usersRoutes.js";
import projectsRoutes from "./router/projectsRoutes.js";
import taskRoutes from "./router/taskRoutes.js";
import cors from "cors";

const app = express();
app.use(express.json());
dotenv.config();
conectDb();

const whitelist = [process.env.FRONTEND_URL];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Error Cors"));
    }
  },
};

app.use(cors(corsOptions));

app.use("/api/users", userRoutes);
app.use("/api/projects", projectsRoutes);
app.use("/api/task", taskRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log("**SERVER RUN IN PORT**", PORT);
});
