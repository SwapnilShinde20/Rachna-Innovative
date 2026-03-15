const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Seller = require('./models/Seller');
const User = require('./models/User');

dotenv.config();

const debug = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected');

    const user = new User({ name: 'Test', email: 'test@test.com', password: '123', role: 'seller' });
    await user.save();
    console.log('User created:', user._id);

    try {
      const seller = await Seller.create({
        userId: user._id,
        companyName: 'Test Co',
        contactName: 'Test Name',
        email: 'test@test.com',
        phone: '1234567890',
        status: 'submitted',
        documents: []
      });
      console.log('Seller created');
    } catch (e) {
      console.error('Seller Creation Error:', JSON.stringify(e.errors, null, 2));
    }

  } catch (err) {
    console.error('Main Error:', err);
  } finally {
    process.exit();
  }
};

debug();
