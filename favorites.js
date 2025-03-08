const favoritesContainer = document.getElementById('favorites-container');
const noFavoritesMessage = document.getElementById('no-favorites');

// Get favorites from localStorage
function getFavorites() {
  const favorites = localStorage.getItem('favorites');
  return favorites ? JSON.parse(favorites) : [];
}

// Save favorites to localStorage
function saveFavorites(favorites) {
  localStorage.setItem('favorites', JSON.stringify(favorites));
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
    favorite.text !== quoteText || favorite.author !== authorText
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
  removeButton.innerHTML = '<i class="fas fa-times"></i>';
  removeButton.addEventListener('click', removeFavorite);
  
  // Create quote text
  const quoteElement = document.createElement('p');
  quoteElement.classList.add('favorite-quote');
  quoteElement.innerHTML = `<i class="fas fa-quote-left favorite-icon"></i>${favorite.text}`;
  
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
  favorites.forEach(favorite => {
    const card = createFavoriteCard(favorite);
    // Add a small delay for staggered animation
    setTimeout(() => {
      favoritesContainer.appendChild(card);
    }, favoritesContainer.children.length * 100);
  });
}

// Initialize the page
window.addEventListener('DOMContentLoaded', displayFavorites); 