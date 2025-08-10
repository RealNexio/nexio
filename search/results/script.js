document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById('searchButton');
    const searchInput = document.getElementById('searchInput');

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

    searchButton.addEventListener('click', redirectToSearchPage);
    searchInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            redirectToSearchPage();
        }
    });
});
