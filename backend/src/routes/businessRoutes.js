const express = require('express');
const businessController = require('../controllers/businessController');
const { protect } = require('../middleware/auth');
const { businessAdmin, superAdminOnly } = require('../middleware/rbac');

const router = express.Router();

router.get('/mine', protect, businessAdmin, businessController.getMyBusiness);
router.get('/', protect, superAdminOnly, businessController.getBusinesses);
router.get('/:id', protect, superAdminOnly, businessController.getBusiness);
router.post('/', protect, superAdminOnly, businessController.createBusiness);
router.put('/:id', protect, superAdminOnly, businessController.updateBusiness);

module.exports = router;
