// ====== CSE + AI Overview ======
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const resultsDiv = document.getElementById("results");

// ==== Gemini Config ====
const GEMINI_API_KEY = "YOUR_GEMINI_API_KEY"; // sem daj svoj kľúč

// Funkcia pre vyhľadávanie v Google CSE
function performSearch(query) {
  if (!query) return;

  // Vymaž predchádzajúce výsledky
  resultsDiv.innerHTML = '<p style="text-align:center;color:#ccc;">Loading results...</p>';

  // Spusti AI Overview
  fetchAIOverview(query);

  // Google CSE volanie
  if (window.google && google.search && google.search.cse && google.search.cse.element) {
    const element = google.search.cse.element.getElement("searchresults_only");
    if (element) {
      element.execute(query);
    }
  } else {
    console.warn("Google CSE not loaded yet.");
  }
}

// ==== AI Overview pomocou Gemini ====
async function fetchAIOverview(query) {
  const aiBox = document.getElementById("ai-overview");
  const aiText = document.getElementById("ai-text");

  aiBox.style.display = "block";
  aiText.textContent = "AI is thinking...";

  try {
    const res = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: "Give me a short overview about: " + query }]}]
        })
      }
    );

    const result = await res.json();
    const overviewText = result?.candidates?.[0]?.content?.parts?.[0]?.text;
    aiText.textContent = overviewText || "No AI overview available.";
  } catch (err) {
    console.error("AI Overview Error:", err);
    aiText.textContent = "Error loading AI overview.";
  }
}

// ==== Eventy ====
searchButton.addEventListener("click", () => {
  performSearch(searchInput.value);
});

searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") performSearch(searchInput.value);
});

// ==== Inicializácia Google CSE elementu ====
function initializeCSE() {
  google.search.cse.element.render({
    div: "results",
    tag: 'searchresults_only'
  });
}

// Skontroluj, či sa CSE skript načítal
if (window.google && google.search && google.search.cse) {
  initializeCSE();
} else {
  console.warn("Google CSE script not loaded yet.");
}
