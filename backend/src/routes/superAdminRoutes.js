const express = require('express');
const superAdminController = require('../controllers/superAdminController');
const { protect } = require('../middleware/auth');
const { superAdminOnly } = require('../middleware/rbac');

const router = express.Router();

router.use(protect, superAdminOnly);

router.get('/overview', superAdminController.getOverview);
router.get('/plans', superAdminController.getPlans);
router.post('/plans', superAdminController.createPlan);
router.post('/subscriptions', superAdminController.assignSubscription);
router.get('/audit-logs', superAdminController.getAuditLogs);
router.post('/onboard', superAdminController.onboardBusiness);

module.exports = router;
