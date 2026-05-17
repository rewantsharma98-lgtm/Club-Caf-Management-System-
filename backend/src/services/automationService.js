const AutomationRule = require('../models/AutomationRule');
const notificationService = require('./notificationService');
const loyaltyService = require('./loyaltyService');
const Reservation = require('../models/Reservation');

exports.runTrigger = async (trigger, context) => {
  const { business, branch, reservation, customer } = context;
  const filter = { business, trigger, isActive: true };
  if (branch) filter.$or = [{ branch }, { branch: null }];
  const rules = await AutomationRule.find(filter);

  for (const rule of rules) {
    switch (rule.action) {
      case 'auto_confirm':
        if (reservation && reservation.status === 'Pending') {
          await Reservation.findByIdAndUpdate(reservation._id, { status: 'Approved' });
        }
        break;
      case 'send_notification':
        if (customer) {
          await notificationService.create({
            recipientType: 'customer',
            recipientId: customer._id,
            business,
            type: 'system',
            title: rule.name,
            message: rule.config?.message || 'Update from OpenHouseCafe',
            alsoSend: rule.config?.sendExternal,
          });
        }
        break;
      case 'award_points':
        if (customer && rule.config?.points) {
          await loyaltyService.earnPoints(
            customer._id,
            business,
            'bonus',
            rule.config.points,
            rule.name
          );
        }
        break;
      case 'send_offer':
        if (customer) {
          customer.offers = customer.offers || [];
          customer.offers.push({
            title: rule.config?.title || rule.name,
            description: rule.config?.description || rule.config?.message || 'Exclusive offer for you',
            expiresAt: rule.config?.expiresAt
              ? new Date(rule.config.expiresAt)
              : new Date(Date.now() + 14 * 86400000),
          });
          await customer.save();
          await notificationService.create({
            recipientType: 'customer',
            recipientId: customer._id,
            business,
            type: 'offer',
            title: rule.config?.title || 'Special Offer',
            message: rule.config?.description || 'You have a new personalized offer waiting.',
          });
        }
        break;
      default:
        break;
    }
  }
};

exports.getRules = (businessId) =>
  AutomationRule.find({ business: businessId }).sort({ createdAt: -1 });

exports.createRule = (data) => AutomationRule.create(data);

exports.updateRule = (id, data) =>
  AutomationRule.findByIdAndUpdate(id, data, { new: true });

exports.deleteRule = (id) => AutomationRule.findByIdAndDelete(id);
