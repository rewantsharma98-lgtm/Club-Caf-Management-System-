const express = require('express');
const { body, param } = require('express-validator');
const reservationController = require('../controllers/reservationController');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/auth');

const router = express.Router();

const reservationValidation = [
  body('customerName').trim().notEmpty().withMessage('Name is required'),
  body('phone')
    .trim()
    .matches(/^[\d\s+\-()]{7,20}$/)
    .withMessage('Valid phone number required'),
  body('email').isEmail().normalizeEmail(),
  body('date').isISO8601().withMessage('Valid date required'),
  body('time').trim().notEmpty(),
  body('guests').isInt({ min: 1, max: 50 }),
  body('seatingPreference').optional().isIn(['Indoor', 'Outdoor']),
  body('specialRequest').optional().trim(),
  body('table').optional().isMongoId(),
];

router.post('/', reservationValidation, validate, reservationController.createReservation);
router.get('/stats', protect, reservationController.getStats);
router.get('/', protect, reservationController.getReservations);
router.get('/:id', protect, [param('id').isMongoId()], validate, reservationController.getReservation);
router.put(
  '/:id',
  protect,
  [param('id').isMongoId(), body('status').optional().isIn(['Pending', 'Approved', 'Rejected', 'Completed'])],
  validate,
  reservationController.updateReservation
);
router.patch('/:id/approve', protect, [param('id').isMongoId()], validate, reservationController.approveReservation);
router.delete('/:id', protect, [param('id').isMongoId()], validate, reservationController.deleteReservation);

module.exports = router;
