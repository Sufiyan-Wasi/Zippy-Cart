// Simple test to demonstrate how cookies should be set
console.log("To manually set the auth cookie in your browser, open the developer tools and run this in the console:");

console.log(`
// Set the cookie
document.cookie = "auth-token=eyJhbGciOiJIUzI1NiJ9.eyJpZCI6ImFkbWluLTEiLCJlbWFpbCI6InN1Zml5YW53MDI2QGdtYWlsLmNvbSIsIm5hbWUiOiJBZG1pbiIsInJvbGUiOiJhZG1pbiIsImV4cCI6MTc2NjkzOTE4NX0.VbhIDoLBbskTw85AQbSY-hxi006-Ybr76k2Y9yYh7rI; path=/; SameSite=Lax";

// Verify it was set
console.log("Cookie set:", document.cookie);
`);

console.log("\nThen navigate to http://localhost:3000/admin to access the admin panel.");