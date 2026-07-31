import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import basicAuth from 'express-basic-auth';
import { Persistence } from './persistence/persistence';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

const authMiddleware = basicAuth({
    users: {
        'apoper': process.env.BLOG_PASSWORD!
    }, challenge: true
});

app.use(authMiddleware);

app.get('/', async (req, res) => {
    const result = { currentTime: new Date() };
    res.json(result);
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
