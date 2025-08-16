# 🔥 Firebase Cloud Sync Setup Guide

## Why Firebase?
- **100% FREE** for small apps like this
- **Real-time sync** across all devices
- **Reliable** - used by millions of apps
- **Easy setup** - just copy/paste config

## Setup Steps (5 minutes):

### 1. Create Firebase Project
1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Click "Create a project"
3. Name it: `threepees-hobby-tracker`
4. Disable Google Analytics (not needed)
5. Click "Create project"

### 2. Setup Database
1. In your project, click "Realtime Database"
2. Click "Create Database"
3. Choose "Start in test mode" (for now)
4. Select any location (doesn't matter for this app)

### 3. Get Config
1. Click the ⚙️ (Settings) > "Project settings"
2. Scroll down to "Your apps"
3. Click "Web" icon (</>) 
4. App nickname: `threepees-web`
5. Click "Register app"
6. **COPY the config object** (looks like this):

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "threepees-hobby-tracker.firebaseapp.com",
  databaseURL: "https://threepees-hobby-tracker-default-rtdb.firebaseio.com",
  projectId: "threepees-hobby-tracker",
  storageBucket: "threepees-hobby-tracker.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

### 4. Update script.js
Replace the dummy config in `script.js` (lines 11-19) with your real config.

### 5. Deploy & Test!
Deploy to your domain and test on multiple devices!

## 🛡️ Security
- Database rules are currently open for testing
- For production, we can restrict to password-protected access
- All data is automatically encrypted in transit

## ✨ What This Gives You
- **Cross-device sync**: Phone ↔ Laptop ↔ Tablet
- **Real-time updates**: Changes appear instantly
- **Offline support**: Works without internet, syncs when back online
- **Backup**: Data is safely stored in Google's cloud

## Cost
- **FREE** up to 1GB storage and 10GB bandwidth/month
- This app will use ~1KB total storage
- You'll never hit the limits! 🎉
