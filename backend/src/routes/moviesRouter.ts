import express, { Request, Response, Router } from 'express';
import { Client } from 'pg';

const router: Router = express.Router();
const client = new Client({
    connectionString: process.env.PGURI
});
client.connect();

// Routes for movies, similar to users.js
router.get('/', async (req: Request, res: Response) => {
    try {
        const { rows } = await client.query('SELECT * FROM movies');
        res.json(rows);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Server error');
    }
});

// Example for adding a new movie
router.post('/', async (req: Request, res: Response) => {
    const { title, director, releaseDate } = req.body as { title: string; director: string; releaseDate: string };
    try {
        const result = await client.query('INSERT INTO movies (title, director, release_date) VALUES ($1, $2, $3) RETURNING *', [title, director, releaseDate]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Server error');
    }
});

export default router;
