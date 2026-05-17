const express = require('express');
const waitlistController = require('../controllers/waitlistController');
const { protect } = require('../middleware/auth');
const { businessAdmin } = require('../middleware/rbac');

const router = express.Router();

router.get('/', protect, businessAdmin, waitlistController.getWaitlist);
router.post('/', waitlistController.addToWaitlist);
router.patch('/:id', protect, businessAdmin, waitlistController.updateStatus);

module.exports = router;
