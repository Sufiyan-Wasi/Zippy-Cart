require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

async function checkAdmin() {
  try {
    console.log('Connecting to MongoDB...');
    console.log('MONGODB_URI:', process.env.MONGODB_URI);
    console.log('MONGODB_DB_NAME:', process.env.MONGODB_DB_NAME);
    
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    console.log('Connected successfully to MongoDB');
    
    const db = client.db(process.env.MONGODB_DB_NAME);
    const admin = await db.collection('users').findOne({ email: 'sufiyanw026@gmail.com' });
    
    if (admin) {
      console.log('Admin user found:');
      console.log('ID:', admin.id);
      console.log('Name:', admin.name);
      console.log('Email:', admin.email);
      console.log('Role:', admin.role);
      console.log('Created At:', admin.createdAt);
    } else {
      console.log('Admin user not found in database');
    }
    
    await client.close();
  } catch (err) {
    console.error('Error:', err);
  }
}

checkAdmin();