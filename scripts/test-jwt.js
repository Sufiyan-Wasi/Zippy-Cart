require('dotenv').config({ path: '.env.local' });
const { TextEncoder } = require('util');
const { SignJWT, jwtVerify } = require('jose');

async function testJwt() {
  try {
    console.log('Testing JWT functionality...');
    console.log('JWT_SECRET from env:', process.env.JWT_SECRET);
    
    const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "default-secret-change-in-production");
    console.log('JWT_SECRET encoded length:', JWT_SECRET.length);
    
    // Test creating a token
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
    console.log('Token length:', token.length);
    
    // Test verifying the token
    const { payload } = await jwtVerify(token, JWT_SECRET);
    console.log('Token verified successfully');
    console.log('Payload:', payload);
    
  } catch (err) {
    console.error('Error:', err);
  }
}

testJwt();