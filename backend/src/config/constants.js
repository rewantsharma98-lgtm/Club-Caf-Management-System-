module.exports = {
  ROLES: {
    SUPER_ADMIN: 'super_admin',
    BUSINESS_OWNER: 'business_owner',
    BRANCH_MANAGER: 'branch_manager',
    STAFF: 'staff',
    ADMIN: 'admin', // legacy
  },
  MEMBERSHIP_TIERS: ['Silver', 'Gold', 'Platinum', 'VIP Elite'],
  TIER_THRESHOLDS: { Silver: 0, Gold: 500, Platinum: 1500, 'VIP Elite': 5000 },
  TIER_BENEFITS: {
    Silver: ['Earn loyalty points', 'Birthday reward'],
    Gold: ['Priority booking', '10% event discount', 'Bonus points'],
    Platinum: ['Premium seating', 'Exclusive events', '15% discount'],
    'VIP Elite': ['Private event access', 'Free drinks monthly', 'VIP concierge'],
  },
  POINTS: {
    VISIT: 50,
    RESERVATION: 25,
    EVENT: 100,
    SPEND_PER_DOLLAR: 1,
    REDEMPTION_MIN: 100,
  },
  QR_TYPES: ['reservation', 'event_ticket', 'check_in', 'loyalty', 'table'],
  NOTIFICATION_CHANNELS: ['email', 'whatsapp', 'sms', 'push', 'in_app'],
};
