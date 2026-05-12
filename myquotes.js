const myQuotesContainer = document.getElementById('my-quotes-container');
const noQuotesMessage = document.getElementById('no-quotes');

// Get custom quotes from localStorage
function getCustomQuotes() {
  try {
    const customQuotes = localStorage.getItem('customQuotes');
    return customQuotes ? JSON.parse(customQuotes) : [];
  } catch (error) {
    console.error('Error reading custom quotes from localStorage:', error);
    return [];
  }
}

// Save custom quotes to localStorage
function saveCustomQuotes(quotes) {
  try {
    localStorage.setItem('customQuotes', JSON.stringify(quotes));
  } catch (error) {
    console.error('Error saving custom quotes to localStorage:', error);
    if (error.name === 'QuotaExceededError') {
      alert('Storage quota exceeded. Cannot save changes.');
    }
  }
}

// Remove a custom quote
function removeCustomQuote(event) {
  const cardElement = event.target.closest('.favorite-card');
  const quoteText = cardElement.querySelector('.favorite-quote').textContent;
  const authorText = cardElement.querySelector('.favorite-author').textContent;
  
  // Get current custom quotes
  const customQuotes = getCustomQuotes();
  
  // Filter out the quote to remove
  const updatedQuotes = customQuotes.filter(quote => 
    quote.text !== quoteText && quote.author !== authorText
  );
  
  // Save updated quotes
  saveCustomQuotes(updatedQuotes);
  
  // Add removal animation
  cardElement.style.opacity = '0';
  cardElement.style.transform = 'scale(0.8)';
  
  // Remove the card after animation
  setTimeout(() => {
    cardElement.remove();
    
    // Check if no quotes remaining
    if (updatedQuotes.length === 0) {
      noQuotesMessage.style.display = 'block';
    }
  }, 300);
}

// Create a custom quote card
function createCustomQuoteCard(quote) {
  const quoteCard = document.createElement('div');
  quoteCard.classList.add('favorite-card');
  
  // Create remove button
  const removeButton = document.createElement('button');
  removeButton.classList.add('remove-favorite');
  removeButton.setAttribute('aria-label', `Remove "${quote.author}" from my quotes`);
  removeButton.innerHTML = '<i class="fas fa-times"></i>';
  removeButton.addEventListener('click', removeCustomQuote);
  
  // Create quote text
  const quoteElement = document.createElement('p');
  quoteElement.classList.add('favorite-quote');
  const quoteIcon = document.createElement('i');
  quoteIcon.className = 'fas fa-quote-left favorite-icon';
  const quoteTextNode = document.createTextNode(quote.text);
  quoteElement.appendChild(quoteIcon);
  quoteElement.appendChild(quoteTextNode);
  
  // Create author text
  const authorElement = document.createElement('p');
  authorElement.classList.add('favorite-author');
  authorElement.textContent = quote.author;
  
  // Append elements to card
  quoteCard.appendChild(removeButton);
  quoteCard.appendChild(quoteElement);
  quoteCard.appendChild(authorElement);
  
  return quoteCard;
}

// Display all custom quotes
function displayCustomQuotes() {
  const customQuotes = getCustomQuotes();
  
  // Clear container
  myQuotesContainer.innerHTML = '';
  
  // Check if there are custom quotes
  if (customQuotes.length === 0) {
    noQuotesMessage.style.display = 'block';
    return;
  }
  
  noQuotesMessage.style.display = 'none';
  
  // Sort custom quotes by timestamp (newest first)
  customQuotes.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
  
  // Create and append custom quote cards
  customQuotes.forEach((quote, index) => {
    const card = createCustomQuoteCard(quote);
    // Add a small delay for staggered animation (max 800ms)
    const delay = Math.min(index * 100, 800);
    setTimeout(() => {
      myQuotesContainer.appendChild(card);
    }, delay);
  });
}

// Initialize the page
window.addEventListener('DOMContentLoaded', displayCustomQuotes);
