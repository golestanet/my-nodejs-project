const express = require('express');
const router = express.Router();
const rateController = require('../controllers/rateController');

// API Routes
router.get('/rates', rateController.getAllRates);
router.get('/rates/usd', rateController.getUSDRates);
router.get('/rates/primary', rateController.getPrimaryRate);
router.get('/rates/:key', rateController.getRate);
router.post('/rates/refresh', rateController.refreshRates);
router.get('/health', rateController.healthCheck);

module.exports = router;