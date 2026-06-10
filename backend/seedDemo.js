// Run: node seedDemo.js
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Student = require('./models/Student');
const Recruiter = require('./models/Recruiter');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to MongoDB');

  // ── Demo Student ──────────────────────────────────────────
  let studentUser = await User.findOne({ email: 'student@demo.com' });
  if (!studentUser) {
    studentUser = await User.create({
      name: 'Rahul Sharma',
      email: 'student@demo.com',
      password: 'demo123',
      role: 'student',
    });
    await Student.create({
      userId: studentUser._id,
      college: 'IIT Patna',
      course: 'B.Tech CSE',
      year: 3,
      cgpa: 8.5,
      bio: 'Passionate full-stack developer looking for exciting opportunities.',
      skills: ['React', 'Node.js', 'MongoDB', 'JavaScript'],
    });
    console.log('✅ Demo Student created: student@demo.com / demo123');
  } else {
    console.log('ℹ️  Demo Student already exists');
  }

  // ── Demo Recruiter ────────────────────────────────────────
  let recruiterUser = await User.findOne({ email: 'recruiter@demo.com' });
  if (!recruiterUser) {
    recruiterUser = await User.create({
      name: 'TechCorp India',
      email: 'recruiter@demo.com',
      password: 'demo123',
      role: 'recruiter',
    });
    await Recruiter.create({
      userId: recruiterUser._id,
      companyName: 'TechCorp India',
      industry: 'IT Services',
      website: 'techcorp.in',
      companyDesc: 'Leading IT services company hiring top talent.',
      status: 'approved', // pre-approved for demo
    });
    console.log('✅ Demo Recruiter created: recruiter@demo.com / demo123');
  } else {
    console.log('ℹ️  Demo Recruiter already exists');
  }

  // ── Admin ─────────────────────────────────────────────────
  let adminUser = await User.findOne({ email: 'admin@careerbridge.com' });
  if (!adminUser) {
    await User.create({
      name: 'Admin',
      email: 'admin@careerbridge.com',
      password: 'admin123',
      role: 'admin',
    });
    console.log('✅ Admin created: admin@careerbridge.com / admin123');
  } else {
    console.log('ℹ️  Admin already exists');
  }

  console.log('\n🎉 All demo accounts ready!');
  process.exit(0);
}

seed().catch(e => { console.error(e); process.exit(1); });
