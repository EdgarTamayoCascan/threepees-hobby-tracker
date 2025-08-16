# 🔥 Firestore Real-Time Sync Setup

## Quick Setup for Real Cross-Device Sync

### 1. Create Firebase Project (5 minutes)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Name it: `threepees-hobby-tracker`
4. Disable Google Analytics (not needed)
5. Click "Create project"

### 2. Add Web App

1. In your project, click the web icon `</>`
2. App nickname: `Threepees Web App`
3. Don't check "Firebase Hosting" 
4. Click "Register app"
5. **COPY the config object** - you'll need it!

### 3. Enable Firestore Database

1. In Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (allows read/write for 30 days)
4. Choose location: `europe-west2` (London)
5. Click "Done"

### 4. Update Your Code

Replace the config in `script.js` around line 17:

```javascript
const firebaseConfig = {
    apiKey: "your-actual-api-key",
    authDomain: "threepees-hobby-tracker.firebaseapp.com",
    projectId: "threepees-hobby-tracker",
    storageBucket: "threepees-hobby-tracker.firebasestorage.app",
    messagingSenderId: "123456789",
    appId: "your-actual-app-id"
};
```

### 5. Test Real-Time Sync!

1. Open website on phone
2. Add hobby progress
3. Open same website on laptop
4. **Changes should appear automatically!** 🎉

## Security (Optional but Recommended)

After testing, update Firestore rules:

1. Go to Firestore Database → Rules
2. Replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /userData/cat-threepees-user {
      allow read, write: if true;  // Only Cat's data
    }
  }
}
```

## Troubleshooting

- **Console errors?** Check the Firebase config is correct
- **No sync?** Check browser console for Firebase errors
- **Old data?** Clear browser data and reload

## Result: Real-Time Magic! ✨

- **Add progress on phone** → **Instantly appears on laptop**
- **Works offline** → **Syncs when back online**
- **No manual sharing needed** → **Automatic everywhere**

Perfect for Cat's anniversary gift! 💝
