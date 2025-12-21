require('dotenv').config({ path: '.env.local' });
const { TextEncoder } = require('util');
const { SignJWT, jwtVerify } = require('jose');
const { MongoClient } = require('mongodb');

async function manualAuthTest() {
  try {
    console.log('Manual authentication test...');
    
    // 1. Create a JWT token for the admin user
    const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "default-secret-change-in-production");
    
    const user = {
      id: 'admin-1',
      name: 'Admin',
      email: 'sufiyanw026@gmail.com',
      role: 'admin'
    };
    
    console.log('Creating token for user:', user);
    
    const token = await new SignJWT({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(JWT_SECRET);
      
    console.log('Token created successfully');
    console.log('Token:', token);
    
    // 2. Verify the token
    const { payload } = await jwtVerify(token, JWT_SECRET);
    console.log('Token verified successfully');
    console.log('Payload:', payload);
    
    // 3. Test connecting to MongoDB and retrieving the user
    console.log('Connecting to MongoDB...');
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    console.log('Connected successfully to MongoDB');
    
    const db = client.db(process.env.MONGODB_DB_NAME);
    const dbUser = await db.collection('users').findOne({ email: user.email });
    
    if (dbUser) {
      console.log('User found in database:', dbUser.email, dbUser.role);
    } else {
      console.log('User not found in database');
    }
    
    await client.close();
    
    console.log('\n=== AUTHENTICATION TEST COMPLETE ===');
    console.log('If you want to manually test in browser, set this cookie:');
    console.log(`auth-token=${token}`);
    
  } catch (err) {
    console.error('Error:', err);
  }
}

manualAuthTest();