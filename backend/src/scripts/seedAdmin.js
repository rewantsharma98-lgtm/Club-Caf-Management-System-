require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Business = require('../models/Business');
const Branch = require('../models/Branch');
const Event = require('../models/Event');
const Reward = require('../models/Reward');
const SubscriptionPlan = require('../models/SubscriptionPlan');
const BusinessSubscription = require('../models/BusinessSubscription');
const AutomationRule = require('../models/AutomationRule');
const Table = require('../models/Table');
const MenuItem = require('../models/MenuItem');
const { ROLES } = require('../config/constants');

const 

seed = async () => {
  const defaultLocalUri = 'mongodb://127.0.0.1:27017/openhousecafe';
  const rawUri = process.env.MONGODB_URI;
  const uri = rawUri?.trim() || defaultLocalUri;
  if (!rawUri) {
    console.warn('\n⚠️ No MONGODB_URI found in backend/.env. Falling back to local MongoDB for development.\n');
    console.warn(`Use docker compose up -d and then run: MONGODB_URI=${defaultLocalUri}`);
  }
  const { getMongoOptions, formatMongoError } = require('../config/mongoOptions');
  try {
    await mongoose.connect(uri, getMongoOptions(uri));
  } catch (err) {
    console.error('\n✗ Cannot connect to MongoDB:\n');
    console.error(formatMongoError(err));
    console.error('\n  Then run: npm run seed\n');
    process.exit(1);
  }

  // Subscription plans
  const plans = await SubscriptionPlan.countDocuments();
  if (plans === 0) {
    await SubscriptionPlan.insertMany([
      { name: 'Starter', slug: 'starter', priceMonthly: 49, maxBranches: 1, features: ['Reservations', 'Events', 'Basic Analytics'] },
      { name: 'Growth', slug: 'growth', priceMonthly: 149, maxBranches: 5, features: ['Loyalty', 'Memberships', 'Automation', 'QR'] },
      { name: 'Enterprise', slug: 'enterprise', priceMonthly: 399, maxBranches: 50, features: ['Multi-branch', 'Advanced Analytics', 'Priority Support', 'AI-Ready'] },
    ]);
    console.log('Subscription plans seeded');
  }

  // Super admin
  const superEmail = process.env.SUPER_ADMIN_EMAIL || 'super@openhousecafe.com';
  if (!(await User.findOne({ email: superEmail }))) {
    await User.create({
      username: 'superadmin',
      email: superEmail,
      password: process.env.SUPER_ADMIN_PASSWORD || 'Super@12345',
      role: ROLES.SUPER_ADMIN,
    });
    console.log('Super admin:', superEmail);
  }

  // Business
  let business = await Business.findOne({ slug: 'openhouse-main' });
  if (!business) {
    business = await Business.create({
      name: 'OpenHouse Cafe & Lounge',
      slug: 'openhouse-main',
      type: 'lounge',
      description: 'Premium nightlife & hospitality experience',
      email: 'hello@openhousecafe.com',
      phone: '+1 (555) 012-3456',
      address: '42 Neon District, Downtown',
      settings: { autoConfirmReservations: false, loyaltyEnabled: true, membershipsEnabled: true },
    });
    console.log('Business created');
  }

  const growthPlan = await SubscriptionPlan.findOne({ slug: 'growth' });
  if (growthPlan && !(await BusinessSubscription.findOne({ business: business._id }))) {
    await BusinessSubscription.create({
      business: business._id,
      plan: growthPlan._id,
      status: 'active',
      currentPeriodEnd: new Date(Date.now() + 90 * 86400000),
    });
  }

  // Branches
  if ((await Branch.countDocuments({ business: business._id })) === 0) {
    await Branch.insertMany([
      { business: business._id, name: 'Downtown Lounge', code: 'DT01', address: '42 Neon District', capacity: 120 },
      { business: business._id, name: 'Riverside Pub', code: 'RS02', address: '8 Harbor Walk', capacity: 80 },
    ]);
    console.log('Branches seeded');
  }

  const mainBranch = await Branch.findOne({ business: business._id, code: 'DT01' });

  // Business owner / legacy admin
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@openhousecafe.com';
  let admin = await User.findOne({ email: adminEmail });
  if (!admin) {
    admin = await User.create({
      username: process.env.ADMIN_USERNAME || 'admin',
      email: adminEmail,
      password: process.env.ADMIN_PASSWORD || 'Admin@12345',
      role: ROLES.BUSINESS_OWNER,
      business: business._id,
      branch: mainBranch?._id,
    });
    console.log('Business owner:', adminEmail);
  } else {
    admin.role = ROLES.BUSINESS_OWNER;
    admin.business = business._id;
    await admin.save();
  }

  // Events
  if ((await Event.countDocuments({ business: business._id })) === 0) {
    await Event.insertMany([
      {
        business: business._id,
        branch: mainBranch?._id,
        title: 'Neon Nights DJ Set',
        image: 'https://images.unsplash.com/photo-1571266028243-e4733b0fbf6c?w=800&q=80',
        description: 'Premium DJ experience with immersive lighting and craft cocktails.',
        date: new Date(Date.now() + 7 * 86400000),
        featured: true,
        capacity: 150,
      },
      {
        business: business._id,
        branch: mainBranch?._id,
        title: 'Live Jazz & Lounge',
        image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80',
        description: 'Intimate live music evening in our velvet lounge setting.',
        date: new Date(Date.now() + 14 * 86400000),
        featured: true,
        capacity: 80,
        memberOnly: false,
      },
      {
        business: business._id,
        title: 'VIP Midnight Mixology',
        image: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800&q=80',
        description: 'Exclusive cocktail experience — Platinum members & above.',
        date: new Date(Date.now() + 21 * 86400000),
        featured: true,
        memberOnly: true,
        minTier: 'Platinum',
        capacity: 40,
      },
    ]);
    console.log('Events seeded');
  }

  // Rewards
  if ((await Reward.countDocuments({ business: business._id })) === 0) {
    await Reward.insertMany([
      { business: business._id, title: 'Complimentary Cocktail', description: 'Any signature cocktail', pointsCost: 200, category: 'drink' },
      { business: business._id, title: 'Priority Reservation', description: 'Skip the queue on weekends', pointsCost: 350, category: 'priority' },
      { business: business._id, title: '20% Event Discount', description: 'Next featured event', pointsCost: 500, category: 'event' },
      { business: business._id, title: 'VIP Lounge Access', description: 'Private lounge for one evening', pointsCost: 1000, category: 'vip', vipOnly: true },
      { business: business._id, title: 'Birthday Celebration Package', description: 'Champagne + dessert platter', pointsCost: 400, category: 'birthday' },
    ]);
    console.log('Rewards seeded');
  }

  // Tables
  if ((await Table.countDocuments({ business: business._id })) === 0) {
    await Table.insertMany([
      { business: business._id, branch: mainBranch?._id, number: 1, label: 'Table 1', capacity: 2, type: 'Standard', zone: 'Indoor', qrCode: 'TBL-01' },
      { business: business._id, branch: mainBranch?._id, number: 2, label: 'Table 2', capacity: 2, type: 'Standard', zone: 'Indoor', qrCode: 'TBL-02' },
      { business: business._id, branch: mainBranch?._id, number: 4, label: 'Table 4', capacity: 4, type: 'Lounge', zone: 'Lounge Seating', qrCode: 'TBL-04' },
      { business: business._id, branch: mainBranch?._id, number: 5, label: 'Table 5', capacity: 4, type: 'Lounge', zone: 'Lounge Seating', qrCode: 'TBL-05' },
      { business: business._id, branch: mainBranch?._id, number: 7, label: 'Table 7', capacity: 6, type: 'VIP', zone: 'VIP Corner', qrCode: 'TBL-07' },
      { business: business._id, branch: mainBranch?._id, number: 8, label: 'Table 8', capacity: 6, type: 'VIP', zone: 'VIP Corner', qrCode: 'TBL-08' },
      { business: business._id, branch: mainBranch?._id, number: 10, label: 'Bar 10', capacity: 2, type: 'Bar', zone: 'Bar', qrCode: 'TBL-10' },
    ]);
    console.log('Tables seeded');
  }

  // Menu
  if ((await MenuItem.countDocuments({ business: business._id })) === 0) {
    await MenuItem.insertMany([
      { business: business._id, category: 'signature', name: 'Midnight Old Fashioned', description: 'Bourbon, bitters, orange peel', price: 18, image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&q=80', isFeatured: true, sortOrder: 1 },
      { business: business._id, category: 'signature', name: 'Velvet Espresso Martini', description: 'Vodka, espresso, vanilla', price: 17, image: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=600&q=80', isFeatured: true, sortOrder: 2 },
      { business: business._id, category: 'cocktails', name: 'Negroni Sbagliato', description: 'Campari, vermouth, prosecco', price: 16, image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&q=80', sortOrder: 1 },
      { business: business._id, category: 'cocktails', name: 'Smoked Maple Sour', description: 'Whiskey, maple, lemon', price: 17, sortOrder: 2 },
      { business: business._id, category: 'food', name: 'Truffle Arancini', description: 'Parmesan, truffle oil', price: 14, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80', isFeatured: true, sortOrder: 1 },
      { business: business._id, category: 'food', name: 'Charcoal & Sea Salt', description: 'Chef special flatbread', price: 22, image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=600&q=80', sortOrder: 2 },
      { business: business._id, category: 'nightlife', name: 'Bottle Service — Gold', description: 'Premium spirits package', price: 350, sortOrder: 1 },
      { business: business._id, category: 'specials', name: 'Weekend Tasting Flight', description: 'Four curated pours', price: 28, sortOrder: 1 },
    ]);
    console.log('Menu seeded');
  }

  // Automation rules
  if ((await AutomationRule.countDocuments({ business: business._id })) === 0) {
    await AutomationRule.insertMany([
      {
        business: business._id,
        name: 'Auto-confirm off-peak',
        trigger: 'reservation_created',
        action: 'send_notification',
        config: { message: 'We received your reservation and will confirm shortly.' },
        isActive: true,
      },
      {
        business: business._id,
        name: 'Welcome bonus points',
        trigger: 'visit_completed',
        action: 'award_points',
        config: { points: 25 },
        isActive: true,
      },
    ]);
    console.log('Automation rules seeded');
  }

  await mongoose.disconnect();
  console.log('\n✓ Phase 3 seed complete');
  console.log('  Super Admin:', superEmail, '/ Super@12345');
  console.log('  Business Owner:', adminEmail, '/ Admin@12345');
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
