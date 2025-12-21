import requests

# Test the login API
login_url = "http://localhost:3000/api/auth/login"
admin_stats_url = "http://localhost:3000/api/admin/stats"

# Test login
print("Testing login...")
login_data = {
    "email": "sufiyanw026@gmail.com",
    "password": "WasiSufiyan026"
}

# Create a session to persist cookies
session = requests.Session()

# Login
response = session.post(login_url, json=login_data)
print(f"Login status code: {response.status_code}")
print(f"Login response text: {response.text}")
print(f"Login response headers: {response.headers}")

# Test accessing admin stats
print("\nTesting admin stats access...")
response = session.get(admin_stats_url)
print(f"Admin stats status code: {response.status_code}")
print(f"Admin stats response text: {response.text}")
print(f"Admin stats response headers: {response.headers}")

# Print cookies
print(f"\nCookies: {session.cookies}")