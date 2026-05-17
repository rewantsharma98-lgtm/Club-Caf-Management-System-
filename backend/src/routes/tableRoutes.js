const express = require('express');
const tableController = require('../controllers/tableController');

const router = express.Router();

router.get('/available', tableController.getAvailable);

module.exports = router;
