const crypto = require('crypto');
const Customer = require('../models/Customer');
const LoyaltyTransaction = require('../models/LoyaltyTransaction');
const Reward = require('../models/Reward');
const RewardRedemption = require('../models/RewardRedemption');
const { POINTS, TIER_THRESHOLDS, MEMBERSHIP_TIERS } = require('../config/constants');
const membershipService = require('./membershipService');

exports.earnPoints = async (customerId, businessId, type, points, description, reference) => {
  const customer = await Customer.findById(customerId);
  if (!customer) throw new Error('Customer not found');

  await LoyaltyTransaction.create({
    customer: customerId,
    business: businessId,
    type,
    points,
    description,
    referenceId: reference?.id,
    referenceModel: reference?.model,
  });

  customer.loyaltyPoints += points;
  customer.lifetimePoints += points;
  await customer.save();
  await membershipService.updateTier(customer);

  return customer;
};

exports.awardVisit = (customerId, businessId) =>
  exports.earnPoints(customerId, businessId, 'earn_visit', POINTS.VISIT, 'Visit reward');

exports.awardReservation = (customerId, businessId, reservationId) =>
  exports.earnPoints(customerId, businessId, 'earn_reservation', POINTS.RESERVATION, 'Reservation completed', {
    id: reservationId,
    model: 'Reservation',
  });

exports.awardEvent = (customerId, businessId, eventId) =>
  exports.earnPoints(customerId, businessId, 'earn_event', POINTS.EVENT, 'Event attendance', {
    id: eventId,
    model: 'Event',
  });

exports.getHistory = (customerId, limit = 20) =>
  LoyaltyTransaction.find({ customer: customerId }).sort({ createdAt: -1 }).limit(limit);

exports.getRewards = (businessId) =>
  Reward.find({ business: businessId, isActive: true }).sort({ pointsCost: 1 });

exports.redeemReward = async (customerId, rewardId) => {
  const customer = await Customer.findById(customerId);
  const reward = await Reward.findById(rewardId);
  if (!customer || !reward) throw new Error('Invalid redemption');
  if (customer.loyaltyPoints < reward.pointsCost) throw new Error('Insufficient points');
  if (reward.vipOnly && !['Platinum', 'VIP Elite'].includes(customer.membershipTier)) {
    throw new Error('VIP reward — upgrade membership required');
  }

  customer.loyaltyPoints -= reward.pointsCost;
  await customer.save();

  await LoyaltyTransaction.create({
    customer: customerId,
    business: reward.business,
    type: 'redeem',
    points: -reward.pointsCost,
    description: `Redeemed: ${reward.title}`,
    referenceId: reward._id,
    referenceModel: 'Reward',
  });

  const code = crypto.randomBytes(4).toString('hex').toUpperCase();
  const redemption = await RewardRedemption.create({
    customer: customerId,
    reward: rewardId,
    business: reward.business,
    pointsSpent: reward.pointsCost,
    code,
  });

  return { redemption, customer, reward };
};

exports.getDashboard = async (customerId) => {
  const customer = await Customer.findById(customerId);
  if (!customer) throw new Error('Customer not found');
  const history = await exports.getHistory(customerId, 10);
  const redemptions = await RewardRedemption.find({ customer: customerId })
    .populate('reward')
    .sort({ createdAt: -1 })
    .limit(5);
  const nextTier = MEMBERSHIP_TIERS[MEMBERSHIP_TIERS.indexOf(customer.membershipTier) + 1];
  const nextThreshold = nextTier ? TIER_THRESHOLDS[nextTier] : null;
  return {
    points: customer.loyaltyPoints,
    lifetimePoints: customer.lifetimePoints,
    tier: customer.membershipTier,
    nextTier,
    pointsToNextTier: nextThreshold ? Math.max(0, nextThreshold - customer.lifetimePoints) : 0,
    history,
    redemptions,
  };
};
