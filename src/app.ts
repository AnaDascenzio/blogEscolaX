import 'reflect-metadata';
import './lib/typeorm/typeorm';
import 'jsonwebtoken';
import express from 'express';
import userRouter from './api/controllers/user/route';
import postRouter from './api/controllers/post/route';
import { errorMiddleware } from './api/middlewares/error.middleware';

const app = express();

app.use(express.json());

app.get('/', (_req, res) => {
  res.send('Hello World, testando fluxo CI!');
});

app.use('/users', userRouter);
app.use('/posts', postRouter);

app.use(errorMiddleware);

app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});