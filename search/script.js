// ==========================================================
// Nastavenie a inicializácia Firebase
// ==========================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-analytics.js";

const firebaseConfig = {
    apiKey: "AIzaSyBC7Nq7CBfZWKAiCmez2PETrUALZpAJhpI",
    authDomain: "nexio-search.firebaseapp.com",
    projectId: "nexio-search",
    storageBucket: "nexio-search.firebasestorage.app",
    messagingSenderId: "359269532538",
    appId: "1:359269532538:web:ebb2ed5d6c0749b8564cc3",
    measurementId: "G-MKFH06VJEC"
};

const googleApiKey = "AIzaSyCrJiKX01Myq4exIRzcUBx9jNS1Mu8lDdM";
const searchEngineId = "967a9236a9c554e8f";

const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const loginButton = document.getElementById('loginButton');
const logoutButton = document.getElementById('logoutButton');
const userStatusSpan = document.getElementById('userStatus');

let isPremium = false;

// ==========================================================
// Firebase login/logout
// ==========================================================

const isFirebaseConfigValid = () => {
    return firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId &&
           firebaseConfig.apiKey !== "YOUR_API_KEY";
};

if (isFirebaseConfigValid()) {
    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);
    const auth = getAuth(app);
    const googleProvider = new GoogleAuthProvider();

    onAuthStateChanged(auth, (user) => {
        if (user) {
            isPremium = true;
            if (userStatusSpan) userStatusSpan.textContent = 'Premium User';
            if (loginButton) loginButton.classList.add('hidden');
            if (logoutButton) logoutButton.classList.remove('hidden');
        } else {
            isPremium = false;
            if (userStatusSpan) userStatusSpan.textContent = 'Basic User';
            if (loginButton) loginButton.classList.remove('hidden');
            if (logoutButton) logoutButton.classList.add('hidden');
        }
    });

    if (loginButton) {
        loginButton.addEventListener('click', () => {
            signInWithPopup(auth, googleProvider).catch(() => {
                // Len tichá chyba, nič nezobrazíme na stránke
            });
        });
    }

    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            signOut(auth).catch(() => {
                // Len tichá chyba
            });
        });
    }
} else {
    if (loginButton) loginButton.disabled = true;
    if (logoutButton) logoutButton.disabled = true;
    if (userStatusSpan) userStatusSpan.textContent = "Login Disabled";
}

// ==========================================================
// Search redirect
// ==========================================================

document.addEventListener('DOMContentLoaded', () => {
    function redirectToSearchPage() {
        const query = searchInput.value.trim();
        if (query === '') return;
        window.location.href = `results.html?q=${encodeURIComponent(query)}`;
    }

    if (searchButton) {
        searchButton.addEventListener('click', redirectToSearchPage);
    }
    if (searchInput) {
        searchInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                redirectToSearchPage();
            }
        });
    }
});
