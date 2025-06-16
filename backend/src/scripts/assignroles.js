import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/user.model.js';

dotenv.config();

async function backfillRoles() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const result = await User.updateMany(
      { role: { $exists: false } },
      { $set: { role: 'user' } }
    );

    const result2 = await User.updateOne(
      { email: 'lucadmin@gmail.com' },
      { $set: { role: 'admin' } }
    );

    console.log(`✅ Updated ${result.modifiedCount} user(s) to role: 'user'`);
    if (result2.modifiedCount === 1) {
      console.log('Promoted lucadmin@gmail.com to admin');
    } else {
      console.log('lucadmin@gmail.com not found or already admin');
    }
  } catch (err) {
    console.error('❌ Error during role backfill:', err);
  } finally {
    await mongoose.disconnect();
  }
}

backfillRoles();
