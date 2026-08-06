import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import postRoutes from './routes/post-routes';
import authRoutes from './routes/auth-routes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use('/posts', postRoutes);
app.use('/auth', authRoutes);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
