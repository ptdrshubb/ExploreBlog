import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import connectDB from './configs/db.js';

import adminRouter from './routes/adminRoutes.js';
import blogRouter from './routes/blogRoutes.js';
import userRouter from './routes/userRoutes.js';
import subscriberRouter from './routes/subscriberRoutes.js';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.send('API is Working');
});

app.use('/api/admin', adminRouter);
app.use('/api/blog', blogRouter);
app.use('/api/user', userRouter);
app.use('/api/subscriber', subscriberRouter);

// Database connection
await connectDB();

export default app;