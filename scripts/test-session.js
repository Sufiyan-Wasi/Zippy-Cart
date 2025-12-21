require('dotenv').config({ path: '.env.local' });

// Mock the cookies function since we're not in a Next.js environment
async function mockCookies() {
  return {
    set: (name, value, options) => {
      console.log(`Setting cookie: ${name}=${value}`);
      console.log('Cookie options:', options);
    }
  };
}

// Simulate the session creation process
async function testSessionCreation() {
  try {
    console.log('Testing session creation...');
    
    // Import the session functions
    const { createToken } = await import('../lib/auth.js');
    
    // Mock user data
    const user = {
      id: 'admin-1',
      name: 'Admin',
      email: 'sufiyanw026@gmail.com',
      role: 'admin'
    };
    
    console.log('Creating token for user:', user);
    
    // Create token
    const token = await createToken(user);
    console.log('Token created successfully');
    console.log('Token length:', token.length);
    
    // Mock cookie store
    const cookieStore = await mockCookies();
    
    // Set session cookie
    cookieStore.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });
    
    console.log('Session created successfully!');
  } catch (err) {
    console.error('Error:', err);
  }
}

testSessionCreation();