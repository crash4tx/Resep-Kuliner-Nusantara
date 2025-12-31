import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import provinceRoutes from './routes/provinces.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/provinces', provinceRoutes);

app.listen(3000, () => {
  console.log('API running on http://localhost:3000');
});
