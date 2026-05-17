const express = require('express');
const qrController = require('../controllers/qrController');
const { protect } = require('../middleware/auth');
const { businessAdmin } = require('../middleware/rbac');

const router = express.Router();

router.get('/verify/:token', qrController.verify);
router.post('/scan/:token', protect, businessAdmin, qrController.scan);
router.post('/generate', protect, businessAdmin, qrController.generate);
router.post('/reservation/:id', protect, businessAdmin, qrController.generateForReservation);

module.exports = router;
