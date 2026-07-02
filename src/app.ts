import 'reflect-metadata'
import './lib/typeorm/typeorm'
import express from 'express';
import userRouter from './api/controllers/user/route';
import postRouter from './api/controllers/post/route';

const app = express();

app.use(express.json());
app.use('/users', userRouter);
app.use('/posts', postRouter);

app.get('/', (_req, res) => {
  res.send('Hello World, testando fluxo CI!');
});

app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});
