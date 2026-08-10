import app from "./app";
import { env } from "./config/env";

const startServer = async () => {
  try {
    app.listen(env.port, () => {
      console.log(`Server is running on port ${env.port}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
};

startServer();
