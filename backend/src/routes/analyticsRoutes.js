const express = require('express');
const analyticsController = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');
const { businessAdmin, superAdminOnly } = require('../middleware/rbac');

const router = express.Router();

router.get('/business', protect, businessAdmin, analyticsController.getBusinessAnalytics);
router.get('/platform', protect, superAdminOnly, analyticsController.getSuperAdminAnalytics);

module.exports = router;
