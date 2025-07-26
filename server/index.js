import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

await connectDB(process.env.MONGO_URI);

app.get('/', (req, res) => res.json({ message: 'API is running' }));

// Later: mount routes for auth, users, videos, comments, channel

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
