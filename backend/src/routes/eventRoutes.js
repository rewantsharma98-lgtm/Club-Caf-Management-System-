const express = require('express');
const { body, param } = require('express-validator');
const eventController = require('../controllers/eventController');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/auth');

const router = express.Router();

const eventValidation = [
  body('title').trim().notEmpty(),
  body('image').trim().notEmpty(),
  body('description').optional().trim(),
  body('date').isISO8601(),
  body('featured').optional().isBoolean(),
];

router.get('/', eventController.getEvents);
router.get('/:id', [param('id').isMongoId()], validate, eventController.getEvent);
router.post('/', protect, eventValidation, validate, eventController.createEvent);
router.put('/:id', protect, [param('id').isMongoId(), ...eventValidation], validate, eventController.updateEvent);
router.delete('/:id', protect, [param('id').isMongoId()], validate, eventController.deleteEvent);

module.exports = router;
