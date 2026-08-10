import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { corsOptions } from "./config/cors";
import router from "./routes";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware";

const app = express();

app.use(helmet());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "Server is running",
  });
});

app.use("/api/v1", router);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
