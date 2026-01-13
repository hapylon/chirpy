import express from "express";
import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";

import { handlerReadiness } from "./api/readiness.js";
import { handlerChirps } from "./api/chirps.js";
import { handlerGetChirps } from "./api/getchirps.js";
import { handlerGetOneChirp } from "./api/getonechirp.js";
import { handlerMetrics } from "./admin/metrics.js";
import { handlerReset } from "./admin/reset.js";
import { handlerCreateUser } from "./api/createuser.js";
import { 
  middlewareLogResponse, 
  middlewareMetricsInc 
} from "./api/middleware.js"; 
import { errorHandler } from "./api/errorhandler.js"
import { config } from "./config.js";
import { Forbidden } from "./api/errorhandler.js";

const migrationClient = postgres(config.db.url, { max: 1 });
await migrate(drizzle(migrationClient), config.db.migrationConfig);

const app = express();
// const PORT = 8080;

app.use(express.json());
app.use(middlewareLogResponse);
app.use("/app", middlewareMetricsInc, express.static("./src/app"));

app.get("/api/healthz", handlerReadiness);
app.get("/admin/metrics", handlerMetrics);
app.post("/admin/reset", handlerReset);

app.post("/api/chirps", async (req, res, next) =>  {
  try {
    await handlerChirps(req, res);
  } catch (err) {
    next(err);
  }
});
app.get("/api/chirps", async (req, res, next) =>  {
  try {
    await handlerGetChirps(req, res);
  } catch (err) {
    next(err);
  }
});
app.get("/api/chirps/:name", async (req, res, next) =>  {
  try {
    await handlerGetOneChirp(req, res);
  } catch (err) {
    next(err);
  }
});
app.post("/api/users", handlerCreateUser);

app.use(errorHandler);
app.listen(config.api.port, () => {
  console.log(`Server is running at http://localhost:${config.api.port}`);
});