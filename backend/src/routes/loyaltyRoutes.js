const express = require('express');
const loyaltyController = require('../controllers/loyaltyController');
const { protect } = require('../middleware/auth');
const { businessAdmin } = require('../middleware/rbac');

const router = express.Router();

router.get('/rewards', loyaltyController.getRewards);
router.get('/customer/:customerId', protect, businessAdmin, loyaltyController.getCustomerLoyalty);
router.post('/rewards', protect, businessAdmin, loyaltyController.createReward);
router.put('/rewards/:id', protect, businessAdmin, loyaltyController.updateReward);
router.delete('/rewards/:id', protect, businessAdmin, loyaltyController.deleteReward);
router.post('/award', protect, businessAdmin, loyaltyController.awardBonus);

module.exports = router;
