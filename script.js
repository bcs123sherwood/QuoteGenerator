const quoteContainer = document.getElementById("quote-container");
const quoteText = document.getElementById("quote");
const authorText = document.getElementById("author");
const twitterBtn = document.getElementById("twitter");
const favoriteBtn = document.getElementById("favorite");
const favoriteIcon = favoriteBtn.querySelector("i");
const newQuoteBtn = document.getElementById("new-quote");
const loader = document.getElementById("loader");

let apiQuotes = [];
let currentQuote = {};
// Animation classes
const animationClasses = [
  'animate-fadeIn',
  'animate-slideInLeft',
  'animate-slideInRight',
  'animate-slideInUp',
  'animate-slideInDown',
  'animate-zoomIn',
  'animate-rotateIn'
];

// Subtle background colors for quote container
const backgroundColors = [
  'rgba(255, 255, 255, 0.95)',
  'rgba(249, 250, 255, 0.95)',
  'rgba(246, 255, 251, 0.95)',
  'rgba(255, 250, 244, 0.95)',
  'rgba(252, 246, 255, 0.95)',
  'rgba(246, 252, 255, 0.95)',
  'rgba(255, 245, 248, 0.95)'
];

// Show Loading
function loading() {
  loader.style.display = 'block';
  quoteContainer.style.display = 'none';
}

// Apply random animation and subtle color change
function applyRandomAnimation() {
  // Remove any existing animation classes
  animationClasses.forEach(animClass => {
    quoteContainer.classList.remove(animClass);
  });
  
  // Select a random animation class
  const randomIndex = Math.floor(Math.random() * animationClasses.length);
  const randomAnimation = animationClasses[randomIndex];
  
  // Apply the new animation class
  quoteContainer.classList.add(randomAnimation);
  
  // Apply a subtle background color change
  const colorIndex = Math.floor(Math.random() * backgroundColors.length);
  quoteContainer.style.backgroundColor = backgroundColors[colorIndex];
}

// Hide Loading
function complete() {
  loader.style.display = 'none';
  quoteContainer.style.display = 'block';
  applyRandomAnimation();
}

// Get Quotes From API
async function getQuotes() {
  loading();
  const apiURL = "https://jacintodesign.github.io/quotes-api/data/quotes.json";
  try {
    const response = await fetch(apiURL);
    apiQuotes = await response.json();
    newQuote();
  } catch (error) {
    console.log('Error fetching quotes', error);
    // Retry after 3 seconds
    setTimeout(getQuotes, 3000);
  }
}

// Check if quote is already in favorites
function isQuoteInFavorites(quoteObj) {
  const favorites = getFavorites();
  return favorites.some(favorite => 
    favorite.text === quoteObj.text && favorite.author === quoteObj.author
  );
}

// Update favorite button appearance
function updateFavoriteButton() {
  if (isQuoteInFavorites(currentQuote)) {
    favoriteIcon.classList.remove('far');
    favoriteIcon.classList.add('fas');
    favoriteBtn.classList.add('favorite-active');
  } else {
    favoriteIcon.classList.remove('fas');
    favoriteIcon.classList.add('far');
    favoriteBtn.classList.remove('favorite-active');
  }
}

// Show New Quote
function newQuote() {
  loading();
  // pick a random quote from apiQuotes array
  const quote = apiQuotes[Math.floor(Math.random() * apiQuotes.length)];
  //Check if Author field is blank and replace it with 'Unknown'
  if (!quote.author) {
    authorText.textContent = "Unknown";
  } else {
    authorText.textContent = quote.author;
  }
  // Check Quote length to determine the styling
  if (quote.text.length > 120) {
    quoteText.classList.add("long-quote");
  } else {
    quoteText.classList.remove("long-quote");
  }
  
  // Store current quote for favorites
  currentQuote = {
    text: quote.text,
    author: quote.author || "Unknown"
  };
  
  quoteText.textContent = quote.text;
  
  // Update favorite button
  updateFavoriteButton();
  
  // Show quote and hide loader
  complete();
}

// Get favorites from localStorage
function getFavorites() {
  const favorites = localStorage.getItem('favorites');
  return favorites ? JSON.parse(favorites) : [];
}

// Save favorites to localStorage
function saveFavorites(favorites) {
  localStorage.setItem('favorites', JSON.stringify(favorites));
}

// Toggle favorite status
function toggleFavorite() {
  const favorites = getFavorites();
  
  if (isQuoteInFavorites(currentQuote)) {
    // Remove from favorites
    const updatedFavorites = favorites.filter(favorite => 
      favorite.text !== currentQuote.text || favorite.author !== currentQuote.author
    );
    saveFavorites(updatedFavorites);
    favoriteIcon.classList.remove('fas');
    favoriteIcon.classList.add('far');
    favoriteBtn.classList.remove('favorite-active');
  } else {
    // Add to favorites
    favorites.push({
      text: currentQuote.text,
      author: currentQuote.author,
      timestamp: new Date().getTime()
    });
    saveFavorites(favorites);
    favoriteIcon.classList.remove('far');
    favoriteIcon.classList.add('fas');
    favoriteBtn.classList.add('favorite-active');
  }
  
  // Add a small animation effect
  favoriteIcon.classList.add('animate-zoomIn');
  setTimeout(() => {
    favoriteIcon.classList.remove('animate-zoomIn');
  }, 700);
}

// Share Quote on X (formerly Twitter)
function shareOnX() {
  const xUrl = `https://twitter.com/intent/tweet?text=${quoteText.textContent} - ${authorText.textContent}`; // URL still uses twitter.com
  window.open(xUrl, '_blank');
}

// Event Listeners
newQuoteBtn.addEventListener('click', newQuote);
twitterBtn.addEventListener('click', shareOnX);
favoriteBtn.addEventListener('click', toggleFavorite);

// On Load
getQuotes();
