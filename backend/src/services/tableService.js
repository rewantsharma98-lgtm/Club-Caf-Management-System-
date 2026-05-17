const Table = require('../models/Table');
const Reservation = require('../models/Reservation');
const Business = require('../models/Business');

const dayBounds = (dateInput) => {
  const d = new Date(dateInput);
  const start = new Date(d);
  start.setHours(0, 0, 0, 0);
  const end = new Date(d);
  end.setHours(23, 59, 59, 999);
  return { start, end };
};

exports.getAvailableTables = async ({ businessId, branchId, date, time, guests }) => {
  let bizId = businessId;
  if (!bizId) {
    const biz = await Business.findOne({ isActive: true });
    bizId = biz?._id;
  }
  if (!bizId) return [];

  const guestCount = Math.max(1, parseInt(guests, 10) || 1);
  const filter = {
    business: bizId,
    isActive: true,
    capacity: { $gte: guestCount },
  };
  if (branchId) filter.branch = branchId;

  const tables = await Table.find(filter).sort({ number: 1 });
  const { start, end } = dayBounds(date);

  const booked = await Reservation.find({
    business: bizId,
    date: { $gte: start, $lte: end },
    time,
    status: { $in: ['Pending', 'Approved'] },
    table: { $ne: null },
  }).select('table');

  const bookedIds = new Set(booked.map((r) => String(r.table)));

  return tables.map((t) => ({
    _id: t._id,
    number: t.number,
    label: t.label,
    capacity: t.capacity,
    type: t.type,
    zone: t.zone,
    available: !bookedIds.has(String(t._id)),
  }));
};

exports.findTableByQr = async (qrCode) => {
  if (!qrCode) return null;
  return Table.findOne({ qrCode, isActive: true });
};
