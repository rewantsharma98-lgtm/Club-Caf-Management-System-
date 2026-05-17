const Customer = require('../models/Customer');
const { TIER_THRESHOLDS, TIER_BENEFITS, MEMBERSHIP_TIERS } = require('../config/constants');

exports.getTierForPoints = (lifetimePoints) => {
  let tier = 'Silver';
  for (const t of MEMBERSHIP_TIERS) {
    if (lifetimePoints >= TIER_THRESHOLDS[t]) tier = t;
  }
  return tier;
};

exports.updateTier = async (customer) => {
  const newTier = exports.getTierForPoints(customer.lifetimePoints);
  if (customer.membershipTier !== newTier) {
    customer.membershipTier = newTier;
    customer.membershipSince = new Date();
    await customer.save();
  }
  return customer;
};

exports.getMembershipInfo = (customer) => ({
  tier: customer.membershipTier,
  since: customer.membershipSince,
  benefits: TIER_BENEFITS[customer.membershipTier] || [],
  lifetimePoints: customer.lifetimePoints,
  nextTier: MEMBERSHIP_TIERS[MEMBERSHIP_TIERS.indexOf(customer.membershipTier) + 1] || null,
});

exports.hasPriorityBooking = (customer) =>
  ['Gold', 'Platinum', 'VIP Elite'].includes(customer.membershipTier);
