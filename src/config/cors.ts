import cors from "cors";
import { env } from "./env";

export const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || env.clientUrls.includes(origin)) {
      return callback(null, true);
    }
    return callback(null, false);
  },
  credentials: true,
};
