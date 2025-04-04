import express from 'express';
import db from '../db_connection.js';
import bodyParser from 'body-parser';

const router = express.Router();


router.get('/', (req, res) => {
    res.send('Welcome to the Author API!');
});


export default router;