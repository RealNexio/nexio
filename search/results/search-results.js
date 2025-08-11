document.addEventListener('DOMContentLoaded', () => {
    const resultsContainer = document.getElementById('results');
    const prevButton = document.getElementById('prevPage');
    const nextButton = document.getElementById('nextPage');
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    
    const apiKey = "AIzaSyCrJiKX01Myq4exIRzcUBx9jNS1Mu8lDdM"; 
    const cx = "967a9236a9c554e8f"; 

    const numResults = 10;
    let currentPage = 1;
    let currentQuery = '';

    const urlParams = new URLSearchParams(window.location.search);
    const initialQuery = urlParams.get('q');
    
    if (initialQuery) {
        searchInput.value = initialQuery;
        currentQuery = initialQuery;
        performSearch(currentQuery, currentPage);
    } else {
        resultsContainer.innerHTML = '<p>Search something...</p>';
    }

    searchButton.addEventListener('click', () => {
        currentPage = 1;
        const newQuery = searchInput.value.trim();
        if (newQuery) {
            currentQuery = newQuery;
            performSearch(currentQuery, currentPage);
        }
    });

    searchInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            searchButton.click();
        }
    });

    nextButton.addEventListener('click', () => {
        currentPage++;
        performSearch(currentQuery, currentPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            performSearch(currentQuery, currentPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });

    async function performSearch(queryText, page) {
        resultsContainer.innerHTML = '<p style="text-align: center; color: #ccc;">Načítavam výsledky...</p>';
        const startIndex = (page - 1) * numResults + 1;
        
        const apiUrl = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(queryText)}&start=${startIndex}&num=${numResults}`;
        
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Chyba pri volaní API: ${response.status} ${response.statusText} - ${errorData.error.message}`);
            }
            const data = await response.json();

            resultsContainer.innerHTML = '';
            
            if (data.items && data.items.length > 0) {
                data.items.forEach(item => {
                    const resultItem = document.createElement('div');
                    resultItem.classList.add('result-item');
                    resultItem.innerHTML = `
                        <h3><a href="${item.link}" target="_blank">${item.title}</a></h3>
                        <p class="link">${item.displayLink}</p>
                        <p>${item.snippet}</p>
                    `;
                    resultsContainer.appendChild(resultItem);
                });
            } else {
                resultsContainer.innerHTML = '<p style="text-align: center; color: #ccc;">Neboli nájdené žiadne výsledky.</p>';
            }

            prevButton.style.display = (currentPage > 1) ? 'inline-block' : 'none';

            if (data.queries && data.queries.nextPage) {
                nextButton.style.display = 'inline-block';
            } else {
                nextButton.style.display = 'none';
            }

        } catch (error) {
            console.error('Došlo k chybe:', error);
            resultsContainer.innerHTML = `<p style="color:red; text-align: center;">Došlo k chybe pri načítaní výsledkov: ${error.message}</p>`;
            prevButton.style.display = 'none';
            nextButton.style.display = 'none';
        }
    }
});
