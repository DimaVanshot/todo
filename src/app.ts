import { config } from 'dotenv';
import express from 'express';

import categoryRouter from './routes/category.router';
import healthRouter from './routes/health.router';
import todosRouter from './routes/todos.router';

config(); // читает .env
export function buildApp() {
  const app = express();
  app.use(express.json());
  // Роуты
  app.use('/health', healthRouter);
  app.use('/api/todos', todosRouter);
  app.use('/category', categoryRouter);
  // 404
  app.use((req, res) => res.status(404).json({ error: 'Not Found' }));
  // Ошибки
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    },
  );
  return app;
}
