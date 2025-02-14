import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import dotenv from 'dotenv';
import complaintRoutes from './routes/complaint.routes';
dotenv.config();

const PORT = process.env.PORT || 8000;

const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/complaints', complaintRoutes);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
