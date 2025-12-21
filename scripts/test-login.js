require('dotenv').config({ path: '.env.local' });
const bcrypt = require('bcryptjs');
const { MongoClient } = require('mongodb');

async function testLogin() {
  try {
    console.log('Testing login for admin user...');
    
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    console.log('Connected successfully to MongoDB');
    
    const db = client.db(process.env.MONGODB_DB_NAME);
    const user = await db.collection('users').findOne({ email: 'sufiyanw026@gmail.com' });
    
    if (!user) {
      console.log('User not found');
      await client.close();
      return;
    }
    
    console.log('User found:', user.email, user.role);
    
    // Test password verification
    const password = 'WasiSufiyan026';
    const isPasswordValid = bcrypt.compareSync(password, user.passwordHash);
    console.log('Password valid:', isPasswordValid);
    
    if (isPasswordValid) {
      console.log('Login successful!');
    } else {
      console.log('Login failed: Incorrect password');
    }
    
    await client.close();
  } catch (err) {
    console.error('Error:', err);
  }
}

testLogin();