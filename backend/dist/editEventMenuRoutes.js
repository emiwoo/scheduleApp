import express from 'express';
import pool from './db.js';
const router = express.Router();
router.post('/createevent', (req, res) => {
    try {
        if (!req.user)
            throw new Error();
        pool.query(`INSERT INTO events (title, priority, time, date, notes, user_id, all_day)
                    VALUES ($1, $2, $3, $4, $5, $6, $7)`, [req.body.title, req.body.priority, req.body.time, req.body.date, req.body.notes, req.user.id, req.body.allDay]);
        res.status(201).json({ success: 'Event created' });
    }
    catch (error) {
        console.error('/createevent error: ', error);
        res.status(400).json({ error: 'Could not create event' });
    }
});
router.get('/loaddata/:id', async (req, res) => {
    try {
        if (!req.user)
            throw new Error();
        const result = await pool.query(`SELECT title, date, time, priority, notes, all_day
                                         FROM events
                                         WHERE id = $1`, [req.params.id]);
        res.status(200).json(result.rows[0]);
    }
    catch (error) {
        console.error('/loaddata/:id error: ', error);
        res.status(400).json({ error: 'Could not load data' });
    }
});
router.patch('/updateevent/:id', async (req, res) => {
    try {
        if (!req.user)
            throw new Error();
        pool.query(`UPDATE events
                    SET title = $1,
                        priority = $2,
                        time = $3,
                        date = $4,
                        notes = $5,
                        all_day = $6
                    WHERE user_id = $7
                        AND id = $8`, [req.body.title, req.body.priority, req.body.time, req.body.date, req.body.notes, req.body.allDay, req.user.id, req.params.id]);
        res.status(200).json({ success: 'Updated event' });
    }
    catch (error) {
        console.error('/updateevent/:id error: ', error);
        res.status(400).json({ error: 'Could not update event' });
    }
});
router.delete('/deleteevent/:id', (req, res) => {
    try {
        if (!req.user)
            throw new Error();
        pool.query(`DELETE FROM events
                    WHERE user_id = $1
                        AND id = $2`, [req.user.id, req.params.id]);
        res.status(200).json({ success: 'Deleted event from edit event menu' });
    }
    catch (error) {
        console.error('/deleteevent/:id error: ', error);
        res.status(400).json({ error: 'Could not delete event' });
    }
});
export default router;
//# sourceMappingURL=editEventMenuRoutes.js.map