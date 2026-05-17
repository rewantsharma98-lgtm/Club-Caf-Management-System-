const express = require('express');
const { body } = require('express-validator');
const portalController = require('../controllers/portalController');
const loyaltyController = require('../controllers/loyaltyController');
const validate = require('../middleware/validate');
const { protectCustomer } = require('../middleware/customerAuth');

const router = express.Router();

router.post(
  '/register',
  [
    body('name').notEmpty(),
    body('email').isEmail(),
    body('phone').notEmpty(),
    body('password').isLength({ min: 6 }),
  ],
  validate,
  portalController.register
);

router.post(
  '/login',
  [body('email').isEmail(), body('password').notEmpty()],
  validate,
  portalController.login
);

router.get('/me', protectCustomer, portalController.getProfile);
router.put('/me', protectCustomer, portalController.updateProfile);
router.get('/dashboard', protectCustomer, portalController.getDashboard);
router.get('/reservations', protectCustomer, portalController.getReservations);
router.get('/notifications', protectCustomer, portalController.getNotifications);
router.patch('/notifications/:id/read', protectCustomer, portalController.markNotificationRead);
router.get('/qr', protectCustomer, portalController.getQRs);
router.get('/loyalty', protectCustomer, async (req, res, next) => {
  req.params = { customerId: req.customer._id.toString() };
  return loyaltyController.getCustomerLoyalty(req, res, next);
});
router.get('/membership', protectCustomer, portalController.getMembership);
router.post('/loyalty/redeem', protectCustomer, loyaltyController.redeem);
router.patch('/notifications/read-all', protectCustomer, async (req, res, next) => {
  const notificationService = require('../services/notificationService');
  await notificationService.markAllRead(req.customer._id);
  return res.json({ success: true });
});

module.exports = router;
