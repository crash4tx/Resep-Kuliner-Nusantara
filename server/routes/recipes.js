import express from 'express';
import { supabase } from '../supabaseClient.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/:id/vote', authMiddleware, async (req, res) => {
  const recipeId = req.params.id;
  const { value } = req.body;

  if (![1, -1].includes(value)) {
    return res.status(400).json({ error: 'Invalid vote value' });
  }

  const { error } = await supabase
    .from('votes')
    .upsert({
      user_id: req.user.id,
      recipe_id: recipeId,
      value
    });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json({ success: true });
});

export default router;
