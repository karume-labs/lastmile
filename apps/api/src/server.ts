import cors from 'cors';
import express, { type Request, type Response } from 'express';
import helmet from 'helmet';
import authRouter from './features/auth/routers';

const PORT = Number(process.env.PORT || '8000');
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRouter);

app.listen(PORT, () => {
  console.log(`Express API running on http://localhost:${PORT}`);
});
