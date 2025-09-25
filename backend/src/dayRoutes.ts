import express from 'express';
import type { Request, Response } from 'express';
import pool from './db.js';

const router = express.Router();

interface AllowedUser extends Request {
    user?: Id;
}

type Id = {
    id: number;
}

router.get('/loaddayevents/:date', async (req: AllowedUser, res: Response) => {
    try {
        if (!req.user) throw new Error();
        const result = await pool.query(`SELECT title, priority, id
                                         FROM events
                                         WHERE date = $1
                                            AND user_id = $2`, [req.params.date, req.user.id]);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('/loaddayevents/:date error: ', error);
        res.status(400).json({ error: 'Could not load day events' });
    }
});

export default router;