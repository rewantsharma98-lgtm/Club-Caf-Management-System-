const Reservation = require('../models/Reservation');
const Customer = require('../models/Customer');
const Event = require('../models/Event');
const LoyaltyTransaction = require('../models/LoyaltyTransaction');

const monthLabels = () => {
  const labels = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    labels.push(d.toLocaleString('default', { month: 'short' }));
  }
  return labels;
};

exports.getBusinessAnalytics = async (businessId, branchId) => {
  const baseFilter = { ...(businessId ? { business: businessId } : {}), ...(branchId ? { branch: branchId } : {}) };
  const now = new Date();
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [
    totalReservations,
    completedReservations,
    pendingReservations,
    totalCustomers,
    repeatCustomers,
    recentReservations,
    events,
    loyaltyEarned,
  ] = await Promise.all([
    Reservation.countDocuments(baseFilter),
    Reservation.countDocuments({ ...baseFilter, status: 'Completed' }),
    Reservation.countDocuments({ ...baseFilter, status: 'Pending' }),
    Customer.countDocuments(businessId ? { business: businessId } : {}),
    Customer.countDocuments({
      ...(businessId ? { business: businessId } : {}),
      totalVisits: { $gte: 2 },
    }),
    Reservation.find({ ...baseFilter, createdAt: { $gte: thirtyDaysAgo } }),
    Event.find({ ...baseFilter, date: { $gte: now } }).limit(5),
    LoyaltyTransaction.aggregate([
      { $match: { ...(businessId ? { business: businessId } : {}), points: { $gt: 0 } } },
      { $group: { _id: null, total: { $sum: '$points' } } },
    ]),
  ]);

  const bookingGrowth = monthLabels().map((label, idx) => {
    const start = new Date();
    start.setMonth(start.getMonth() - (5 - idx));
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);
    const count = recentReservations.filter(
      (r) => r.createdAt >= start && r.createdAt < end
    ).length;
    return { label, value: count };
  });

  const hourMap = {};
  recentReservations.forEach((r) => {
    const h = parseInt(r.time?.split(':')[0] || '20', 10);
    hourMap[h] = (hourMap[h] || 0) + 1;
  });
  const peakHours = Object.entries(hourMap)
    .map(([hour, count]) => ({ hour: `${hour}:00`, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  const retentionRate =
    totalCustomers > 0 ? Math.round((repeatCustomers / totalCustomers) * 100) : 0;

  return {
    overview: {
      totalReservations,
      completedReservations,
      pendingReservations,
      totalCustomers,
      repeatCustomers,
      retentionRate,
      loyaltyPointsIssued: loyaltyEarned[0]?.total || 0,
    },
    bookingGrowth,
    peakHours,
    eventPerformance: events.map((e) => ({
      title: e.title,
      date: e.date,
      capacity: e.capacity,
      sold: e.ticketsSold,
      fillRate: e.capacity ? Math.round((e.ticketsSold / e.capacity) * 100) : 0,
    })),
    insights: [
      retentionRate > 40
        ? 'Strong customer retention — loyalty program is performing well.'
        : 'Focus on repeat visits — consider targeted offers for returning guests.',
      peakHours[0]
        ? `Peak booking hour: ${peakHours[0].hour} — optimize staffing accordingly.`
        : 'Collect more booking data to identify peak hours.',
    ],
  };
};

exports.getSuperAdminAnalytics = async () => {
  const Business = require('../models/Business');
  const BusinessSubscription = require('../models/BusinessSubscription');

  const [businesses, activeSubs, totalReservations, totalCustomers] = await Promise.all([
    Business.countDocuments(),
    BusinessSubscription.countDocuments({ status: 'active' }),
    Reservation.countDocuments(),
    Customer.countDocuments(),
  ]);

  return {
    overview: { businesses, activeSubs, totalReservations, totalCustomers },
    platformHealth: 'operational',
  };
};
