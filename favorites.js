const favoritesContainer = document.getElementById('favorites-container');
const noFavoritesMessage = document.getElementById('no-favorites');

// Get favorites from localStorage
function getFavorites() {
  try {
    const favorites = localStorage.getItem('favorites');
    return favorites ? JSON.parse(favorites) : [];
  } catch (error) {
    console.error('Error reading favorites from localStorage:', error);
    return [];
  }
}

// Save favorites to localStorage
function saveFavorites(favorites) {
  try {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  } catch (error) {
    console.error('Error saving favorites to localStorage:', error);
    if (error.name === 'QuotaExceededError') {
      alert('Storage quota exceeded. Please remove some favorites.');
    }
  }
}

// Remove a favorite quote
function removeFavorite(event) {
  const cardElement = event.target.closest('.favorite-card');
  const quoteText = cardElement.querySelector('.favorite-quote').textContent;
  const authorText = cardElement.querySelector('.favorite-author').textContent;
  
  // Get current favorites
  const favorites = getFavorites();
  
  // Filter out the quote to remove
  const updatedFavorites = favorites.filter(favorite => 
    favorite.text !== quoteText && favorite.author !== authorText
  );
  
  // Save updated favorites
  saveFavorites(updatedFavorites);
  
  // Add removal animation
  cardElement.style.opacity = '0';
  cardElement.style.transform = 'scale(0.8)';
  
  // Remove the card after animation
  setTimeout(() => {
    cardElement.remove();
    
    // Check if no favorites remaining
    if (updatedFavorites.length === 0) {
      noFavoritesMessage.style.display = 'block';
    }
  }, 300);
}

// Create a favorite quote card
function createFavoriteCard(favorite) {
  const favoriteCard = document.createElement('div');
  favoriteCard.classList.add('favorite-card');
  
  // Create remove button
  const removeButton = document.createElement('button');
  removeButton.classList.add('remove-favorite');
  removeButton.setAttribute('aria-label', `Remove "${favorite.author}" from favorites`);
  removeButton.innerHTML = '<i class="fas fa-times"></i>';
  removeButton.addEventListener('click', removeFavorite);
  
  // Create quote text
  const quoteElement = document.createElement('p');
  quoteElement.classList.add('favorite-quote');
  const quoteIcon = document.createElement('i');
  quoteIcon.className = 'fas fa-quote-left favorite-icon';
  const quoteTextNode = document.createTextNode(favorite.text);
  quoteElement.appendChild(quoteIcon);
  quoteElement.appendChild(quoteTextNode);
  
  // Create author text
  const authorElement = document.createElement('p');
  authorElement.classList.add('favorite-author');
  authorElement.textContent = favorite.author;
  
  // Append elements to card
  favoriteCard.appendChild(removeButton);
  favoriteCard.appendChild(quoteElement);
  favoriteCard.appendChild(authorElement);
  
  return favoriteCard;
}

// Display all favorite quotes
function displayFavorites() {
  const favorites = getFavorites();
  
  // Clear container
  favoritesContainer.innerHTML = '';
  
  // Check if there are favorites
  if (favorites.length === 0) {
    noFavoritesMessage.style.display = 'block';
    return;
  }
  
  noFavoritesMessage.style.display = 'none';
  
  // Sort favorites by timestamp (newest first)
  favorites.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
  
  // Create and append favorite cards
  favorites.forEach((favorite, index) => {
    const card = createFavoriteCard(favorite);
    // Add a small delay for staggered animation (max 800ms)
    const delay = Math.min(index * 100, 800);
    setTimeout(() => {
      favoritesContainer.appendChild(card);
    }, delay);
  });
}

// Initialize the page
window.addEventListener('DOMContentLoaded', displayFavorites); 