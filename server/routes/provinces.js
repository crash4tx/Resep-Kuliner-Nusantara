import express from 'express';
import { supabase } from '../supabaseClient.js';

const router = express.Router();

router.get('/popular', async (req, res) => {
  const { data, error } = await supabase.rpc('get_popular_provinces');

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

export default router;
