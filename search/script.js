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
