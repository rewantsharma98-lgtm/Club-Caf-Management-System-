const express = require('express');
const notificationController = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');
const { businessAdmin } = require('../middleware/rbac');

const router = express.Router();

router.get('/', protect, businessAdmin, notificationController.getBusinessNotifications);
router.post('/send', protect, businessAdmin, notificationController.send);

module.exports = router;
