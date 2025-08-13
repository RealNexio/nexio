// ==========================================================
// Nastavenie a inicializácia Firebase
// ==========================================================

// Import the necessary modules from Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-analytics.js";

// *** IMPORTANT: THIS OBJECT CONTAINS YOUR NEW CONFIGURATION FROM THE FIREBASE CONSOLE ***
// You don't need to change it unless you change the project settings in Firebase.
const firebaseConfig = {

    apiKey: "AIzaSyBC7Nq7CBfZWKAiCmez2PETrUALZpAJhpI",

    authDomain: "nexio-search.firebaseapp.com",

    projectId: "nexio-search",

    storageBucket: "nexio-search.firebasestorage.app",

    messagingSenderId: "359269532538",

    appId: "1:359269532538:web:2f235f84cf10e68a564cc3",

    measurementId: "G-RN2T60XRM0"

  };



// ==========================================================
// Google Custom Search API Settings
// ==========================================================

// These keys are required for the search query that will be used on the results page.
// They are already filled in based on your input.
const googleApiKey = "AIzaSyCrJiKX01Myq4exIRzcUBx9jNS1Mu8lDdM";
const searchEngineId = "967a9236a9c554e8f";

// ==========================================================
// Global variables and DOM elements
// ==========================================================
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const loginButton = document.getElementById('loginButton');
const logoutButton = document.getElementById('logoutButton');
const userStatusSpan = document.getElementById('userStatus');
const firebaseErrorContainer = document.getElementById('firebaseErrorContainer');

let isPremium = false;

// ==========================================================
// Login and logout management
// ==========================================================

// Checks if valid Firebase configuration data is entered
const isFirebaseConfigValid = () => {
    return firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId &&
           firebaseConfig.apiKey !== "YOUR_API_KEY";
};

if (!isFirebaseConfigValid()) {
    const errorMessage = "Firebase error: Configuration is not valid. Login is disabled.";
    console.error(errorMessage);
    if (firebaseErrorContainer) {
        firebaseErrorContainer.innerHTML = `<p class="error-message">${errorMessage}</p>`;
    }
    if (loginButton) loginButton.disabled = true;
    if (logoutButton) logoutButton.disabled = true;
    if (userStatusSpan) userStatusSpan.textContent = "Firebase error";

} else {
    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);
    const auth = getAuth(app);
    const googleProvider = new GoogleAuthProvider();

    // The logic you are looking for is right here!
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
            signInWithPopup(auth, googleProvider)
                .catch((error) => {
                    console.error("Error during Google login:", error);
                    if (firebaseErrorContainer) {
                        if (error.code === 'auth/configuration-not-found') {
                            firebaseErrorContainer.innerHTML = `<p class="error-message">Login error: It seems your site's address (http://127.0.0.1:5500) is not authorized in Firebase. Go to the Firebase Console, find the settings for your web application, and add '127.0.0.1' to the 'Authorized domains' section.</p>`;
                        } else {
                            firebaseErrorContainer.innerHTML = `<p class="error-message">Login error: ${error.message}</p>`;
                        }
                    }
                });
        });
    }

    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            signOut(auth)
                .catch((error) => {
                    console.error("Error during logout:", error);
                    if (firebaseErrorContainer) {
                        firebaseErrorContainer.innerHTML = `<p class="error-message">Logout error: ${error.message}</p>`;
                    }
                });
        });
    }
}

// ==========================================================
// Search and redirect function
// ==========================================================

// We wait until the DOM is loaded and then add event listeners
document.addEventListener('DOMContentLoaded', () => {
    // A function that redirects to the results page with the search query
    function redirectToSearchPage() {
        const query = searchInput.value.trim();
        if (query === '') {
            return;
        }

        // We've modified the path to point to the 'results' subdirectory
        const newUrl = `results.html?q=${encodeURIComponent(query)}`;

        window.location.href = newUrl;
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
