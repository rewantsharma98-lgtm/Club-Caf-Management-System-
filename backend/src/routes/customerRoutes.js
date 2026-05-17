const express = require('express');
const { param } = require('express-validator');
const customerController = require('../controllers/customerController');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, customerController.getCustomers);
router.get('/:id', protect, [param('id').isMongoId()], validate, customerController.getCustomer);

module.exports = router;
