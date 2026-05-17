const Customer = require('../models/Customer');

const upsertCustomer = async ({ name, phone, email, reservationId, businessId }) => {
  const filter = businessId ? { email, business: businessId } : { email };
  let customer = await Customer.findOne(filter);
  if (!customer) {
    customer = await Customer.create({
      name,
      phone,
      email,
      business: businessId,
      reservations: reservationId ? [reservationId] : [],
      totalVisits: 1,
    });
    return customer;
  }
  customer.name = name;
  customer.phone = phone;
  if (reservationId && !customer.reservations.includes(reservationId)) {
    customer.reservations.push(reservationId);
    customer.totalVisits += 1;
    customer.engagement.lastVisit = new Date();
    if (customer.totalVisits >= 10) customer.engagement.visitFrequency = 'high';
    else if (customer.totalVisits >= 3) customer.engagement.visitFrequency = 'medium';
  }
  await customer.save();
  return customer;
};

const getPersonalizedOffers = (customer) => {
  const offers = [...(customer.offers || [])].filter((o) => !o.used && (!o.expiresAt || o.expiresAt > new Date()));
  if (customer.membershipTier === 'VIP Elite') {
    offers.push({
      title: 'VIP Exclusive',
      description: 'Priority access to this weekend\'s private lounge event',
      expiresAt: new Date(Date.now() + 7 * 86400000),
    });
  }
  if (customer.preferences?.seatingPreference) {
    offers.push({
      title: 'Your Favorite Spot',
      description: `We saved your preferred ${customer.preferences.seatingPreference} seating`,
    });
  }
  return offers;
};

module.exports = { upsertCustomer, getPersonalizedOffers };
