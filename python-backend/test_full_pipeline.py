import requests
import json

BASE_URL = "http://localhost:5000"

print("="*80)
print("FULL PIPELINE TEST - FRONTEND TO BACKEND")
print("="*80)

# Step 1: Call /process endpoint (equivalent to /api/chat from Next.js)
print("\n[STEP 1] Testing /process endpoint...")
try:
    response = requests.post(f"{BASE_URL}/process", json={
        "message": "draw a circle",
        "chat_id": "test123"
    }, timeout=60)
    
    process_data = response.json()
    
    if process_data['success']:
        print(f"✅ Code generation SUCCESS")
        print(f"   Generated {len(process_data['code'])} characters of code")
        generated_code = process_data['code']
    else:
        print(f"❌ Code generation FAILED: {process_data.get('error')}")
        exit(1)
except Exception as e:
    print(f"❌ /process endpoint ERROR: {e}")
    import traceback
    traceback.print_exc()
    exit(1)

# Step 2: Call /visualize endpoint (equivalent to /api/render from Next.js)
print("\n[STEP 2] Testing /visualize endpoint...")
try:
    response = requests.post(f"{BASE_URL}/visualize", json={
        "code": generated_code,
        "quality": "l",
        "user_request": "draw a circle"
    }, timeout=120)
    
    visualize_data = response.json()
    
    if visualize_data['success']:
        print(f"✅ Video rendering SUCCESS")
        print(f"   Video URL: {visualize_data['video_url']}")
        print(f"   Video Path: {visualize_data['video_path']}")
        video_url = visualize_data['video_url']
    else:
        print(f"❌ Video rendering FAILED: {visualize_data.get('error')}")
        exit(1)
except Exception as e:
    print(f"❌ /visualize endpoint ERROR: {e}")
    import traceback
    traceback.print_exc()
    exit(1)

# Step 3: Try to access the video
print("\n[STEP 3] Testing video access...")
try:
    full_video_url = f"{BASE_URL}{video_url}"
    print(f"   Trying to access: {full_video_url}")
    
    response = requests.get(full_video_url, timeout=10)
    
    if response.status_code == 200:
        print(f"✅ Video ACCESS SUCCESS")
        print(f"   Content-Type: {response.headers.get('Content-Type')}")
        print(f"   Content-Length: {len(response.content)} bytes")
    else:
        print(f"❌ Video ACCESS FAILED: HTTP {response.status_code}")
        print(f"   Response: {response.text[:200]}")
except Exception as e:
    print(f"❌ Video access ERROR: {e}")
    import traceback
    traceback.print_exc()

print("\n" + "="*80)
print("TEST COMPLETE")
print("="*80)
