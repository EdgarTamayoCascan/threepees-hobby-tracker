// Hobby Tracker App JavaScript

// Configuration and Data
const CONFIG = {
    password: 'icandothis',
    maxDots: 20, // Maximum dots to show in progress bar
    storageKey: 'hobbyTrackerData'
};

// Firestore Real-Time Sync Configuration
let isFirestoreEnabled = false;
let db = null;
let unsubscribe = null;
const USER_ID = 'cat-threepees-user'; // Cat's unique ID

// Firebase Config (you'll need to replace with your actual config)
const firebaseConfig = {
    apiKey: "your-api-key-here",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "your-app-id"
};

async function initFirestore() {
    try {
        // Check if Firebase is available
        if (typeof firebase === 'undefined') {
            console.log('⚠️ Firebase not loaded, using local storage');
            return false;
        }

        // Initialize Firebase
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        
        db = firebase.firestore();
        isFirestoreEnabled = true;
        
        console.log('🔥 Firestore initialized successfully');
        
        // Set up real-time listener
        setupRealtimeSync();
        
        return true;
    } catch (error) {
        console.error('🔥 Firestore init failed:', error);
        return false;
    }
}

// Venue data for each activity - All verified real locations
const VENUES = {
    piano: [
        {
            name: "Islington Piano Teachers",
            description: "Private piano tuition tailored to your goals. Home lessons available across Islington.",
            website: "https://www.islingtonpianoteachers.com",
            address: "Various locations in Islington, London N7",
            mapsQuery: "Islington Piano Teachers"
        },
        {
            name: "Union Chapel",
            description: "Historic venue with beautiful architecture hosting concerts and music events. Perfect inspiration for piano!",
            website: "https://www.unionchapel.org.uk",
            address: "Compton Terrace, Islington, London N1 2UN",
            mapsQuery: "Union Chapel Islington London"
        },
        {
            name: "Angel Recording Studios",
            description: "Famous recording studio where many famous artists have recorded. Tours and music events available.",
            website: "https://angelstudios.co.uk",
            address: "311 Upper Street, Islington, London N1 2TU",
            mapsQuery: "Angel Recording Studios Upper Street Islington"
        },
        {
            name: "City Lit Music Centre",
            description: "Adult education college offering piano courses for all levels in Central London.",
            website: "https://www.citylit.ac.uk",
            address: "Keeley Street, Covent Garden, London WC2B 4BA",
            mapsQuery: "City Lit London Music Courses"
        },
        {
            name: "Morley College Music Department",
            description: "Renowned adult education college with excellent music facilities and piano courses.",
            website: "https://www.morleycollege.ac.uk",
            address: "61 Westminster Bridge Road, London SE1 7HT",
            mapsQuery: "Morley College London Music"
        }
    ],
    pottery: [
        {
            name: "Culford Studios",
            description: "Professional ceramic artists offering workshops. Hand-building and wheel throwing.",
            website: "https://classbento.co.uk/culford-studios",
            address: "Culford Road, London N1",
            mapsQuery: "Culford Studios"
        },
        {
            name: "City Lit Ceramics",
            description: "Well-established ceramics courses for all levels at this famous adult education college.",
            website: "https://www.citylit.ac.uk",
            address: "Keeley Street, Covent Garden, London WC2B 4BA",
            mapsQuery: "City Lit London Ceramics"
        },
        {
            name: "Morley College Ceramics",
            description: "Excellent ceramics facilities and courses ranging from beginner to advanced levels.",
            website: "https://www.morleycollege.ac.uk",
            address: "61 Westminster Bridge Road, London SE1 7HT",
            mapsQuery: "Morley College London Ceramics"
        },
        {
            name: "Turning Earth Pottery",
            description: "Membership-based pottery studio with excellent facilities and community atmosphere.",
            website: "https://www.turningearth.org",
            address: "11A Argall Ave, London E10 7QE",
            mapsQuery: "Turning Earth Pottery London"
        },
        {
            name: "Flux Studios",
            description: "Contemporary pottery studio offering classes and workshops in East London.",
            website: "https://www.fluxstudios.co.uk",
            address: "1-3 Ossory Road, London SE1 5LT",
            mapsQuery: "Flux Studios Pottery London"
        }
    ],
    pilates: [
        {
            name: "Frame Islington",
            description: "Trendy fitness studio with excellent Pilates classes in the heart of Islington.",
            website: "https://moveyourframe.com/studios/islington/",
            address: "368 Upper Street, Islington, London N1 0PD",
            mapsQuery: "Frame 368 Upper Street Islington"
        },
        {
            name: "Ten Health & Fitness Islington",
            description: "Premium fitness studio with state-of-the-art Pilates equipment and expert instructors.",
            website: "https://www.ten.co.uk/studios/islington/",
            address: "1 Rufus Street, Islington, London N1 6PE",
            mapsQuery: "Ten Health Fitness Rufus Street Islington"
        },
        {
            name: "Psycle London",
            description: "Boutique fitness studio offering dynamic Pilates classes in a beautiful space.",
            website: "https://psyclelondon.com",
            address: "119 Mortimer Street, London W1W 6JR",
            mapsQuery: "Psycle London Mortimer Street"
        },
        {
            name: "The Life Centre",
            description: "Established yoga and pilates studio with excellent teachers and calming atmosphere.",
            website: "https://www.thelifecentre.com",
            address: "15 Edge Street, London W8 7PN",
            mapsQuery: "The Life Centre Edge Street London"
        },
        {
            name: "Bodyism London",
            description: "Premium wellness studio offering pilates and fitness classes in Notting Hill.",
            website: "https://bodyism.com",
            address: "64 Ledbury Road, London W11 2AJ",
            mapsQuery: "Bodyism Ledbury Road London"
        }
    ]
};

// Motivational quotes
const QUOTES = [
    "Every expert was once a beginner. Every pro was once an amateur.",
    "The secret of getting ahead is getting started. ✨",
    "Progress, not perfection. You're doing amazing! 🌟",
    "New skills unlock new versions of yourself. 🦋",
    "Every session is a step closer to your dreams. 💫",
    "Growth begins at the end of your comfort zone. 🌱",
    "You're building more than skills - you're building confidence. 💪",
    "Small steps daily lead to big changes yearly. 🎯"
];

// App State
let appData = {
    piano: 0,
    pottery: 0,
    pilates: 0
};

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', async function() {
    if (window.location.pathname.includes('dashboard.html')) {
        // Initialize Firestore first, then dashboard
        await initFirestore();
        initDashboard();
    } else {
        initLogin();
    }
});

// Login functionality
function initLogin() {
    const loginForm = document.getElementById('loginForm');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('errorMessage');

    // Check if already logged in
    if (isLoggedIn()) {
        redirectToDashboard();
        return;
    }

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const password = passwordInput.value.toLowerCase().trim();
        
        if (password === CONFIG.password) {
            // Set login status
            sessionStorage.setItem('isLoggedIn', 'true');
            // Add success animation
            loginForm.style.transform = 'scale(1.05)';
            setTimeout(() => {
                redirectToDashboard();
            }, 300);
        } else {
            showError('Not quite right... try again! 💭');
            passwordInput.value = '';
            passwordInput.focus();
        }
    });

    // Focus on password input
    passwordInput.focus();
}

function showError(message) {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = message;
    errorMessage.style.opacity = '1';
    
    setTimeout(() => {
        errorMessage.style.opacity = '0';
    }, 3000);
}

function isLoggedIn() {
    return sessionStorage.getItem('isLoggedIn') === 'true';
}

function redirectToDashboard() {
    window.location.href = 'dashboard.html';
}

// Dashboard functionality
async function initDashboard() {
    // Check if logged in
    if (!isLoggedIn()) {
        window.location.href = 'index.html';
        return;
    }

    // Initialize cloud sync
    initCloudSync();
    
    // Load data (cloud + local)
    await loadData();
    
    // Initialize all displays
    updateAllDisplays();
    
    // Set random motivational quote
    setRandomQuote();
    
    // Set up venue data
    setupVenues();
}

function setupRealtimeSync() {
    if (!isFirestoreEnabled || !db) return;
    
    const userRef = db.collection('userData').doc(USER_ID);
    
    // Real-time listener for data changes
    unsubscribe = userRef.onSnapshot((doc) => {
        if (doc.exists) {
            const firestoreData = doc.data();
            console.log('🔥 Received real-time update:', firestoreData);
            
            // Only update if data is different (avoid infinite loops)
            if (JSON.stringify(appData) !== JSON.stringify(firestoreData)) {
                appData = { ...appData, ...firestoreData };
                updateProgressBars();
                showSyncStatus('🔥 Synced');
            }
        }
    }, (error) => {
        console.error('🔥 Real-time sync error:', error);
        showSyncStatus('❌ Sync error');
    });
}

async function loadData() {
    showSyncStatus('🔄 Loading...');
    
    // Try Firestore first
    if (isFirestoreEnabled && db) {
        try {
            const userRef = db.collection('userData').doc(USER_ID);
            const doc = await userRef.get();
            
            if (doc.exists) {
                const firestoreData = doc.data();
                appData = { ...appData, ...firestoreData };
                console.log('🔥 Loaded from Firestore:', appData);
                showSyncStatus('🔥 Cloud loaded');
                
                // Save to local as backup
                localStorage.setItem(CONFIG.storageKey, JSON.stringify(appData));
                return;
            } else {
                console.log('🔥 No Firestore data found, checking local storage');
            }
        } catch (error) {
            console.error('🔥 Firestore load error:', error);
            showSyncStatus('❌ Cloud error');
        }
    }
    
    // Fallback to local storage
    const saved = localStorage.getItem(CONFIG.storageKey);
    if (saved) {
        try {
            appData = { ...appData, ...JSON.parse(saved) };
            console.log('💾 Loaded from local storage');
            showSyncStatus('📱 Local data');
            
            // If we have local data but Firestore is enabled, sync it up
            if (isFirestoreEnabled && db) {
                saveToFirestore();
            }
        } catch (e) {
            console.warn('Could not load saved data, using defaults');
            showSyncStatus('🆕 New start');
        }
    } else {
        showSyncStatus('🆕 New start');
    }
}

async function saveData() {
    // Always save locally first (instant)
    localStorage.setItem(CONFIG.storageKey, JSON.stringify(appData));
    
    // Save to Firestore for real-time sync
    if (isFirestoreEnabled && db) {
        await saveToFirestore();
    } else {
        showSyncStatus('💾 Local saved');
    }
}

async function saveToFirestore() {
    if (!isFirestoreEnabled || !db) return;
    
    try {
        showSyncStatus('🔄 Syncing...');
        const userRef = db.collection('userData').doc(USER_ID);
        await userRef.set(appData);
        console.log('🔥 Saved to Firestore successfully');
        showSyncStatus('🔥 Synced');
    } catch (error) {
        console.error('🔥 Firestore save error:', error);
        showSyncStatus('❌ Sync failed');
    }
}

function showSyncOptions() {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
    `;
    
    const syncStatus = isFirestoreEnabled ? '🔥 Real-time sync enabled' : '❌ Cloud sync disabled';
    const description = isFirestoreEnabled ? 
        'Your progress automatically syncs across all devices in real-time!' : 
        'Connect to enable automatic sync between devices.';
    
    modal.innerHTML = `
        <div style="background: white; padding: 30px; border-radius: 20px; max-width: 400px; text-align: center;">
            <h3>📱💻 Cross-Device Sync</h3>
            <div style="margin: 20px 0; padding: 15px; background: ${isFirestoreEnabled ? '#e8f5e8' : '#fff3cd'}; border-radius: 10px;">
                <div style="font-size: 18px; margin-bottom: 10px;">${syncStatus}</div>
                <div>${description}</div>
            </div>
            ${isFirestoreEnabled ? 
                '<p style="color: #27ae60;">✅ Changes sync automatically!</p>' : 
                '<p style="color: #856404;">⚠️ Setup required for full sync</p>'
            }
            <button onclick="this.parentElement.parentElement.remove()" style="background: #667eea; color: white; border: none; padding: 12px 20px; border-radius: 25px; cursor: pointer;">✕ Close</button>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function showSyncStatus(message) {
    // Create or update sync status indicator
    let statusElement = document.getElementById('sync-status');
    if (!statusElement) {
        statusElement = document.createElement('div');
        statusElement.id = 'sync-status';
        statusElement.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 8px 12px;
            border-radius: 20px;
            font-size: 0.8rem;
            z-index: 1000;
            transition: opacity 0.3s ease;
        `;
        document.body.appendChild(statusElement);
    }
    
    statusElement.textContent = message;
    statusElement.style.opacity = '1';
    
    // Hide after 2 seconds
    setTimeout(() => {
        statusElement.style.opacity = '0';
    }, 2000);
}

function updateCount(activity, change) {
    const newCount = Math.max(0, appData[activity] + change);
    appData[activity] = newCount;
    
    // Save to localStorage
    saveData();
    
    // Update display
    updateActivityDisplay(activity);
    
    // Celebration effect for milestones
    if (change > 0 && newCount % 5 === 0 && newCount > 0) {
        celebratemilestone(activity);
    }
    
    // Update quote occasionally
    if (Math.random() < 0.3) {
        setRandomQuote();
    }
}

function updateActivityDisplay(activity) {
    const countElement = document.getElementById(`${activity}-count`);
    const progressElement = document.getElementById(`${activity}-progress`);
    
    if (countElement) {
        countElement.textContent = appData[activity];
    }
    
    if (progressElement) {
        updateProgressDots(progressElement, appData[activity]);
    }
}

function updateProgressDots(container, count) {
    // Clear existing dots
    container.innerHTML = '';
    
    // Calculate number of dots to show (max 20)
    const totalDots = Math.min(Math.max(count, 10), CONFIG.maxDots);
    
    // Create dots
    for (let i = 0; i < totalDots; i++) {
        const dot = document.createElement('div');
        dot.className = 'progress-dot';
        
        if (i < count) {
            dot.classList.add('filled');
        }
        
        container.appendChild(dot);
    }
}

function updateAllDisplays() {
    Object.keys(appData).forEach(activity => {
        updateActivityDisplay(activity);
    });
}

function celebratemilestone(activity) {
    const card = document.querySelector(`.${activity}-card`);
    if (card) {
        card.classList.add('celebration');
        setTimeout(() => {
            card.classList.remove('celebration');
        }, 600);
    }
    
    // Show special message
    const quotes = [
        `Amazing! ${appData[activity]} ${activity} sessions! 🎉`,
        `Milestone reached! You're on fire! 🔥`,
        `${appData[activity]} sessions and counting! Incredible! ⭐`,
        `Look at you go! ${appData[activity]} sessions strong! 💪`
    ];
    
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    updateQuote(randomQuote);
}

function setRandomQuote() {
    const randomQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    updateQuote(randomQuote);
}

function updateQuote(quote) {
    const quoteElement = document.getElementById('motivational-quote');
    if (quoteElement) {
        quoteElement.style.opacity = '0';
        setTimeout(() => {
            quoteElement.textContent = quote;
            quoteElement.style.opacity = '1';
        }, 300);
    }
}

function setupVenues() {
    Object.keys(VENUES).forEach(activity => {
        const venuesList = document.getElementById(`${activity}-venues`);
        if (venuesList) {
            venuesList.innerHTML = VENUES[activity].map(venue => `
                <div class="venue-item">
                    <div class="venue-header">
                        <div class="venue-name">${venue.name}</div>
                        <div class="venue-buttons">
                            ${venue.website !== '#' ? 
                                `<button class="venue-btn website-btn" onclick="openWebsite('${venue.website}')" title="Visit website">
                                    🌐 Website
                                </button>` : ''
                            }
                            <button class="venue-btn maps-btn" onclick="openMaps('${venue.mapsQuery}')" title="View on Google Maps">
                                📍 Maps
                            </button>
                        </div>
                    </div>
                    <div class="venue-description">${venue.description}</div>
                    <div class="venue-address">📍 ${venue.address}</div>
                </div>
            `).join('');
        }
    });
}

function openWebsite(url) {
    if (url && url !== '#') {
        window.open(url, '_blank', 'noopener,noreferrer');
    }
}

function openMaps(query) {
    const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(query)}`;
    window.open(mapsUrl, '_blank', 'noopener,noreferrer');
}

function toggleVenues(activity) {
    const venuesList = document.getElementById(`${activity}-venues`);
    const button = event.target;
    
    if (venuesList.style.display === 'none' || !venuesList.style.display) {
        venuesList.style.display = 'block';
        button.textContent = button.textContent.replace('Find', 'Hide');
        
        // Smooth scroll into view
        venuesList.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'nearest' 
        });
    } else {
        venuesList.style.display = 'none';
        button.textContent = button.textContent.replace('Hide', 'Find');
    }
}

function logout() {
    if (confirm('Are you sure you want to logout? Your progress will be saved! 😊')) {
        sessionStorage.removeItem('isLoggedIn');
        window.location.href = 'index.html';
    }
}

// Keyboard shortcuts for power users
document.addEventListener('keydown', function(e) {
    if (window.location.pathname.includes('dashboard.html')) {
        // Only on dashboard
        if (e.ctrlKey || e.metaKey) {
            switch(e.key) {
                case '1':
                    e.preventDefault();
                    updateCount('piano', 1);
                    break;
                case '2':
                    e.preventDefault();
                    updateCount('pottery', 1);
                    break;
                case '3':
                    e.preventDefault();
                    updateCount('pilates', 1);
                    break;
            }
        }
    }
});

// Add some personality - occasional encouraging messages
setInterval(() => {
    if (window.location.pathname.includes('dashboard.html') && Math.random() < 0.1) {
        // 10% chance every 30 seconds to show encouragement
        const encouragements = [
            "You're doing great! Keep it up! 🌟",
            "Every session counts! 💪",
            "Progress is progress, no matter how small! 🌱",
            "You're building amazing habits! ✨"
        ];
        
        const total = appData.piano + appData.pottery + appData.pilates;
        if (total > 0) {
            const randomEncouragement = encouragements[Math.floor(Math.random() * encouragements.length)];
            updateQuote(randomEncouragement);
        }
    }
}, 30000); // Every 30 seconds
