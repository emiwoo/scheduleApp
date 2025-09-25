import express from 'express';
import pool from './db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const router = express.Router();
router.post('/login', async (req, res) => {
    try {
        const emailResult = await pool.query(`SELECT EXISTS (
                                                           SELECT 1
                                                           FROM users
                                                           WHERE email = $1)`, [req.body.email]);
        const emailExists = emailResult.rows[0]?.exists ?? false;
        if (!emailExists) {
            res.status(400).json({ error: `Email doesn't exist` });
            return;
        }
        const passwordResult = await pool.query(`SELECT password_hash
                                                                FROM users
                                                                WHERE email = $1`, [req.body.email]);
        const password_hash = passwordResult.rows[0]?.password_hash ?? '';
        if (!password_hash) {
            res.status(400).json({ error: 'Invalid login' });
            return;
        }
        const passwordMatch = await bcrypt.compare(req.body.password, password_hash);
        if (!passwordMatch) {
            res.status(400).json({ error: 'Invalid login' });
            return;
        }
        const idResult = await pool.query(`SELECT id
                                               FROM users
                                               WHERE email = $1`, [req.body.email]);
        const id = idResult.rows[0]?.id ?? 0;
        if (!id) {
            res.status(400).json({ error: 'Invalid login' });
            return;
        }
        createJWT(id, res);
        res.status(200).json({ success: 'Valid login' });
    }
    catch (error) {
        console.error('/login error: ', error);
        res.status(400).json({ error: 'Invalid login' });
    }
});
router.post('/register', async (req, res) => {
    try {
        const emailResult = await pool.query(`SELECT EXISTS (
                                                    SELECT 1
                                                    FROM users
                                                    WHERE email = $1)`, [req.body.email]);
        const emailExists = emailResult.rows[0]?.exists ?? false;
        if (emailExists) {
            res.status(409).json({ error: 'Duplicate email' });
            return;
        }
        const password_hash = await bcrypt.hash(req.body.password, 10);
        const idResult = await pool.query(`INSERT INTO users (email, password_hash)
                                   VALUES ($1, $2)
                                   RETURNING id`, [req.body.email, password_hash]);
        const id = idResult.rows[0]?.id ?? 0;
        if (!id) {
            res.status(400).json({ error: 'Invalid id returned' });
            return;
        }
        createJWT(id, res);
        res.status(201).json({ success: 'User registered' });
    }
    catch (error) {
        console.error('/register error: ', error);
        res.status(400).json({ error: 'Unable to register user' });
    }
});
router.post('/logout', async (req, res) => {
    try {
        res.cookie('token', '', {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
            maxAge: 0,
            path: '/'
        });
        res.status(200).json({ success: 'Logged out' });
    }
    catch (error) {
        console.error('/login error: ', error);
        res.status(400).json({ error: 'Unable to logout' });
    }
});
const createJWT = (id, res) => {
    try {
        const token = jwt.sign({ id: id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
            maxAge: 3600 * 1000,
            path: '/'
        });
    }
    catch (error) {
        console.error('createJWT error: ', error);
    }
};
export default router;
//# sourceMappingURL=authRoutes.js.map