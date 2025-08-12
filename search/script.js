// ==========================================================
// Nastavenie a inicializácia Firebase
// ==========================================================

// Importovanie potrebných modulov z Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-analytics.js";

// *** DÔLEŽITÉ: TENTO OBJEKT OBSAHUJE TVOJU NOVÚ KONFIGURÁCIU Z FIREBASE CONSOLE ***
// Už ho nemusíš meniť, pokiaľ nezmeníš nastavenia projektu vo Firebase.
const firebaseConfig = {
    apiKey: "AIzaSyBC7Nq7CBfZWKAiCmez2PETrUALZpAJhpI",
    authDomain: "nexio-search.firebaseapp.com",
    projectId: "nexio-search",
    storageBucket: "nexio-search.firebasestorage.app",
    messagingSenderId: "359269532538",
    appId: "1:359269532538:web:ebb2ed5d6c0749b8564cc3",
    measurementId: "G-MKFH06VJEC"
};

// ==========================================================
// Nastavenie Google Custom Search API
// ==========================================================

// Tieto kľúče sú potrebné pre vyhľadávací dotaz, ktorý sa použije na stránke s výsledkami.
// Aj tieto sú už doplnené na základe tvojho vstupu.
const googleApiKey = "AIzaSyCrJiKX01Myq4exIRzcUBx9jNS1Mu8lDdM";
const searchEngineId = "967a9236a9c554e8f";

// ==========================================================
// Globálne premenné a DOM elementy
// ==========================================================
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const loginButton = document.getElementById('loginButton');
const logoutButton = document.getElementById('logoutButton');
const userStatusSpan = document.getElementById('userStatus');
const firebaseErrorContainer = document.getElementById('firebaseErrorContainer');

let isPremium = false;

// ==========================================================
// Správa prihlásenia a odhlásenia
// ==========================================================

// Skontroluje, či sú zadané platné konfiguračné údaje Firebase
const isFirebaseConfigValid = () => {
    return firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId &&
           firebaseConfig.apiKey !== "YOUR_API_KEY";
};

if (!isFirebaseConfigValid()) {
    const errorMessage = "Firebase chyba: Konfigurácia nie je platná. Prihlásenie je vypnuté.";
    console.error(errorMessage);
    if (firebaseErrorContainer) {
        firebaseErrorContainer.innerHTML = `<p class="error-message">${errorMessage}</p>`;
    }
    if (loginButton) loginButton.disabled = true;
    if (logoutButton) logoutButton.disabled = true;
    if (userStatusSpan) userStatusSpan.textContent = "Chyba Firebase";

} else {
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
            signInWithPopup(auth, googleProvider)
                .catch((error) => {
                    console.error("Chyba pri prihlásení cez Google:", error);
                    if (firebaseErrorContainer) {
                        if (error.code === 'auth/configuration-not-found') {
                            firebaseErrorContainer.innerHTML = `<p class="error-message">Chyba pri prihlásení: Zdá sa, že vaša adresa stránky (http://127.0.0.1:5500) nie je autorizovaná vo Firebase. Prejdite do Firebase Console, nájdite nastavenia svojej webovej aplikácie a do sekcie 'Authorized domains' pridajte '127.0.0.1'.</p>`;
                        } else {
                            firebaseErrorContainer.innerHTML = `<p class="error-message">Chyba pri prihlásení: ${error.message}</p>`;
                        }
                    }
                });
        });
    }

    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            signOut(auth)
                .catch((error) => {
                    console.error("Chyba pri odhlásení:", error);
                    if (firebaseErrorContainer) {
                        firebaseErrorContainer.innerHTML = `<p class="error-message">Chyba pri odhlásení: ${error.message}</p>`;
                    }
                });
        });
    }
}

// ==========================================================
// Funkcia pre vyhľadávanie a presmerovanie
// ==========================================================

// Počkáme, kým sa DOM načíta a potom pridáme poslucháčov udalostí
document.addEventListener('DOMContentLoaded', () => {
    // Funkcia, ktorá presmeruje na stránku s výsledkami s vyhľadávacím dopytom
    function redirectToSearchPage() {
        const query = searchInput.value.trim();
        if (query === '') {
            return;
        }

        // Upravili sme cestu, aby smerovala na podadresár 'results'
        const newUrl = `results?q=${encodeURIComponent(query)}`;

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
