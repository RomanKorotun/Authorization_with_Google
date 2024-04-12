import express from "express";
import cors from "cors";
import logger from "morgan";
import "dotenv/config";
import { authRouter } from "./routes/api/index.js";

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(cors());
app.use(logger(formatsLogger));
app.use(express.json());

app.use("/api/auth", authRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not Found" });
});

app.use((error, req, res, next) => {
  const { status = 500, message = "Server error" } = error;
  res.status(status).json(message);
});

export default app;
