require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

async function testApiLogin() {
  try {
    console.log('Testing API login endpoint...');
    
    // Simulate the login process like the API route does
    const email = 'sufiyanw026@gmail.com';
    const password = 'WasiSufiyan026';
    
    console.log('Connecting to MongoDB...');
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    console.log('Connected successfully to MongoDB');
    
    const db = client.db(process.env.MONGODB_DB_NAME);
    const user = await db.collection('users').findOne({ email: email.toLowerCase() });
    
    if (!user) {
      console.log('User not found');
      await client.close();
      return;
    }
    
    console.log('User found:', user.email, user.role);
    
    // Import bcrypt to verify password
    const bcrypt = require('bcryptjs');
    const isPasswordValid = bcrypt.compareSync(password, user.passwordHash);
    console.log('Password valid:', isPasswordValid);
    
    if (!isPasswordValid) {
      console.log('Invalid password');
      await client.close();
      return;
    }
    
    console.log('Login successful! User authenticated as:', user.role);
    
    await client.close();
  } catch (err) {
    console.error('Error:', err);
  }
}

testApiLogin();