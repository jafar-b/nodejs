import express from 'express';
import db from './db_connection.js';
import bodyParser from 'body-parser';
import userRoutes from './routes/userRoutes.js';
import bookRoutes from './routes/bookRoutes.js';
import genreRoutes from './routes/genreRoutes.js';
import authorRoutes from './routes/authorRoutes.js';
import cors from 'cors';

const app = express();
app.use(bodyParser.json());


app.use("/users",userRoutes);
app.use("/books",bookRoutes);
app.use("/authors",authorRoutes);
app.use("/genres",genreRoutes);

app.use(cors({
  origin: 'http://localhost:3000', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));


app.get('/', (req, res) => {
  res.send('Welcome to the  API!, you have routes for users, books, authors and genres!');
});


app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
