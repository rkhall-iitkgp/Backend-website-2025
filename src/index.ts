import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 8000;

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
