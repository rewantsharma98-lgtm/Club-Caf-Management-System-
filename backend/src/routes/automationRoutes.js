const express = require('express');
const automationController = require('../controllers/automationController');
const { protect } = require('../middleware/auth');
const { businessAdmin } = require('../middleware/rbac');

const router = express.Router();

router.get('/', protect, businessAdmin, automationController.getRules);
router.post('/', protect, businessAdmin, automationController.createRule);
router.put('/:id', protect, businessAdmin, automationController.updateRule);
router.delete('/:id', protect, businessAdmin, automationController.deleteRule);

module.exports = router;
