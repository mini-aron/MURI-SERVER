import express from 'express';
import dotenv from 'dotenv';
import apiRouter from './routes'

dotenv.config();

const app = express();
const port = process.env.SERVER_PORT || 3000;

app.use(express.json());
app.use('/', apiRouter);


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
