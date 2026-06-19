import 'reflect-metadata'
import './lib/typeorm/typeorm'
import express from 'express';

const app = express();

app.get('/', (_req, res) => {
  res.send('Hello World!');
});

app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});