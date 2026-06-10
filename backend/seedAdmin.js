// Run once: node seedAdmin.js
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  const exists = await User.findOne({ email: 'admin@careerbridge.com' });
  if (exists) {
    console.log('✅ Admin already exists');
  } else {
    await User.create({ name: 'Admin', email: 'admin@careerbridge.com', password: 'admin123', role: 'admin' });
    console.log('✅ Admin created: admin@careerbridge.com / admin123');
  }
  process.exit(0);
}
seed().catch(e => { console.error(e); process.exit(1); });
