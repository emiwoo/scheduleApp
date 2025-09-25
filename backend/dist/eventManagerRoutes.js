import express from 'express';
import pool from './db.js';
const router = express.Router();
router.get('/loadevents/:date', async (req, res) => {
    try {
        if (!req.user)
            throw new Error();
        const result = await pool.query(`SELECT title, priority, to_char(time, 'HH12:MI AM') AS formatted_time, date, is_complete, id, all_day
                                         FROM events
                                         WHERE user_id = $1
                                            AND date = $2
                                         ORDER BY 
                                            all_day DESC,
                                            time ASC`, [req.user.id, req.params.date]);
        res.status(200).json(result.rows);
    }
    catch (error) {
        console.error('/loadevents/:date error', error);
        res.status(400).json({ error: 'Could not load events' });
    }
});
router.delete('/deletecompletedevents/:date', (req, res) => {
    try {
        if (!req.user)
            throw new Error();
        pool.query(`DELETE FROM events
                    WHERE user_id = $1
                        AND is_complete = TRUE
                        AND date = $2`, [req.user.id, req.params.date]);
        res.status(200).json({ success: 'Deleted completed events' });
    }
    catch (error) {
        console.error('/deletecompletedevents/:date error', error);
        res.status(400).json({ error: 'Could not delete completed events' });
    }
});
export default router;
//# sourceMappingURL=eventManagerRoutes.js.map