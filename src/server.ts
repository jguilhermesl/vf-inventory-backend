import { errorMiddleware } from './middlewares/error-middleware';
import express from "express";
import { env } from "./env";
import { corsMiddleware } from "./middlewares/cors-middleware";
import { router } from "./routes/routes";

const app = express();

app.use(express.json());
app.use(corsMiddleware);

app.use(router);

app.use(errorMiddleware);

app.listen(env.PORT, () =>
  console.log(`Servidor rodando na porta ${env.PORT}!!!`)
);
