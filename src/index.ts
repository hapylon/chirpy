import express from "express";
import { handlerReadiness } from "./api/readiness.js";
import { handlerValidate } from "./api/validate.js";
import { handlerMetrics } from "./admin/metrics.js";
import { handlerReset } from "./admin/reset.js";
import { 
  middlewareLogResponse, 
  middlewareMetricsInc 
} from "./api/middleware.js"; 
import { errorHandler } from "./api/errorhandler.js"

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(middlewareLogResponse);
app.use("/app", middlewareMetricsInc, express.static("./src/app"));

app.get("/api/healthz", handlerReadiness);
app.get("/admin/metrics", handlerMetrics);
app.post("/admin/reset", handlerReset);
app.post("/api/validate_chirp", async (req, res, next) =>  {
  try {
    await handlerValidate(req, res);
  } catch (err) {
    next(err);
  }
});

app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});