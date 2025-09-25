import express from 'express';
import pool from './db.js';
const router = express.Router();
router.patch('/updatepriority', (req, res) => {
    try {
        if (!req.user)
            throw new Error();
        pool.query(`UPDATE events
                    SET priority = $1
                    WHERE id = $2
                        AND user_id = $3`, [req.body.priority, req.body.id, req.user.id]);
        res.status(201).json({ success: 'Updated priority' });
    }
    catch (error) {
        console.error('/updatepriority error: ', error);
        res.status(400).json({ error: 'Could not update priority on event card' });
    }
});
router.patch('/updatecompletion', (req, res) => {
    try {
        if (!req.user)
            throw new Error();
        pool.query(`UPDATE events
                    SET is_complete = $1
                    WHERE id = $2
                        AND user_id = $3`, [req.body.is_complete, req.body.id, req.user.id]);
        res.status(201).json({ success: 'Updated completion status' });
    }
    catch (error) {
        console.error('/updatecompletion error: ', error);
        res.status(400).json({ error: 'Could not update completion status on event card' });
    }
});
router.delete('/deleteevent/:id', (req, res) => {
    try {
        if (!req.user)
            throw new Error();
        pool.query(`DELETE FROM events
                    WHERE user_id = $1
                        AND id = $2`, [req.user.id, req.params.id]);
        res.status(200).json({ success: 'Deleted event' });
    }
    catch (error) {
        console.error('/deleteevent/:id error: ', error);
        res.status(400).json({ error: 'Could not delete event' });
    }
});
export default router;
//# sourceMappingURL=eventRoutes.js.map