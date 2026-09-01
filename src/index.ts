import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import postRoutes from './routes/post-routes';
import authRoutes from './routes/auth-routes';
import categoryRoutes from './routes/category-routes';
import mediaRoutes from './routes/media-routes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({limit: '20mb'}));
app.use(cors());

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use('/posts', postRoutes);
app.use('/auth', authRoutes);
app.use('/categories', categoryRoutes);
app.use('/media', mediaRoutes);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
