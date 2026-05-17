const MenuItem = require('../models/MenuItem');
const Business = require('../models/Business');
const tableService = require('../services/tableService');

const resolveBusiness = async (businessId) => {
  if (businessId) return businessId;
  const biz = await Business.findOne({ isActive: true });
  return biz?._id;
};

const categoryLabels = {
  signature: 'Signature',
  cocktails: 'Cocktails',
  spirits: 'Spirits',
  food: 'Food',
  specials: 'Specials',
  nightlife: 'Nightlife',
};

exports.getPublicMenu = async (req, res, next) => {
  try {
    const businessId = await resolveBusiness(req.query.businessId);
    if (!businessId) {
      return res.json({ success: true, data: { categories: [], items: [] } });
    }

    const items = await MenuItem.find({ business: businessId, isAvailable: true }).sort({
      category: 1,
      sortOrder: 1,
      name: 1,
    });

    const grouped = {};
    items.forEach((item) => {
      if (!grouped[item.category]) {
        grouped[item.category] = {
          key: item.category,
          label: categoryLabels[item.category] || item.category,
          items: [],
        };
      }
      grouped[item.category].items.push(item);
    });

    return res.json({
      success: true,
      data: {
        categories: Object.values(grouped),
        featured: items.filter((i) => i.isFeatured),
      },
    });
  } catch (err) {
    return next(err);
  }
};

exports.getMenuByTableQr = async (req, res, next) => {
  try {
    const table = await tableService.findTableByQr(req.params.code);
    if (!table) {
      return res.status(404).json({ success: false, message: 'Invalid table QR code' });
    }

    const items = await MenuItem.find({
      business: table.business,
      isAvailable: true,
    }).sort({ category: 1, sortOrder: 1, name: 1 });

    return res.json({
      success: true,
      data: {
        table: {
          _id: table._id,
          label: table.label,
          number: table.number,
          zone: table.zone,
        },
        items,
      },
    });
  } catch (err) {
    return next(err);
  }
};
