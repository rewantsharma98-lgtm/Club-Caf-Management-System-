const express = require('express');
const aiReady = require('../services/aiReady');
const { protect } = require('../middleware/auth');
const { businessAdmin } = require('../middleware/rbac');

const router = express.Router();

router.get('/status', protect, businessAdmin, (req, res) => {
  res.json({
    success: true,
    modules: ['recommendations', 'forecasting', 'assistant', 'marketing'],
    ready: false,
    message: 'AI modules are architecturally ready for provider integration',
  });
});

router.post('/recommendations', protect, businessAdmin, async (req, res) => {
  const data = await aiReady.recommendations.getEventSuggestions(req.body);
  res.json({ success: true, data });
});

module.exports = router;
