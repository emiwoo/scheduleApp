import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import authRoutes from './authRoutes.js';
import editEventMenuRoutes from './editEventMenuRoutes.js';
import eventManagerRoutes from './eventManagerRoutes.js';
import eventRoutes from './eventRoutes.js';
import dayRoutes from './dayRoutes.js';
dotenv.config();
const app = express();
app.use(cors({
    origin: process.env.FRONTEND_DOMAIN,
    methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE'],
    credentials: true
}));
app.use(express.json());
app.use('/api/private', (req, res, next) => {
    try {
        verifyUser(req);
        next();
    }
    catch (error) {
        console.error('/api/private error: ', error);
        res.status(403).json({ error: 'Invalid authorization' });
    }
});
app.use('/api/private/verifyinitialaccess', (req, res) => {
    try {
        verifyUser(req);
        res.status(200).json({ success: 'Valid initial access' });
    }
    catch (error) {
        console.error('/api/private/verifyinitialacess error: ', error);
        res.status(403).json({ error: 'Invalid initial access' });
    }
});
app.use('/api/auth', authRoutes);
app.use('/api/private/editeventmenu', editEventMenuRoutes);
app.use('/api/private/eventmanager', eventManagerRoutes);
app.use('/api/private/event', eventRoutes);
app.use('/api/private/day', dayRoutes);
const verifyUser = (req) => {
    const token = req.headers.cookie?.split('=')[1] ?? '';
    if (!token)
        throw new Error('Undefined token');
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;
};
app.listen(3000, () => console.log('Server is running at port 3000'));
//# sourceMappingURL=server.js.map