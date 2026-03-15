const express = require('express');
const router = express.Router();
const { handleZoomWebhook } = require('../controllers/zoomWebhookController');

// POST /api/zoom/webhook — receives Zoom lifecycle events
router.post('/webhook', handleZoomWebhook);

module.exports = router;
