// DOM Elements
const quoteForm = document.getElementById('quote-form');
const quoteTextInput = document.getElementById('quote-text');
const quoteAuthorInput = document.getElementById('quote-author');
const previewBtn = document.getElementById('preview-quote');
const addQuoteBtn = document.getElementById('add-quote');
const closePreviewBtn = document.getElementById('close-preview');
const closeSuccessBtn = document.getElementById('close-success');

// Preview elements
const previewContainer = document.getElementById('quote-preview-container');
const previewQuoteText = document.getElementById('preview-quote-text');
const previewQuoteAuthor = document.getElementById('preview-quote-author');

// Success message
const successMessage = document.getElementById('success-message');

// Get custom quotes from localStorage
function getCustomQuotes() {
  const customQuotes = localStorage.getItem('customQuotes');
  return customQuotes ? JSON.parse(customQuotes) : [];
}

// Save custom quotes to localStorage
function saveCustomQuotes(quotes) {
  localStorage.setItem('customQuotes', JSON.stringify(quotes));
}

// Show quote preview
function showPreview() {
  // Get values from form
  const quoteText = quoteTextInput.value.trim();
  const quoteAuthor = quoteAuthorInput.value.trim() || 'Unknown';
  
  if (!quoteText) {
    alert('Please enter a quote to preview');
    return;
  }
  
  // Populate preview elements
  previewQuoteText.textContent = quoteText;
  previewQuoteAuthor.textContent = quoteAuthor;
  
  // Check quote length for styling
  if (quoteText.length > 120) {
    previewQuoteText.classList.add('long-quote');
  } else {
    previewQuoteText.classList.remove('long-quote');
  }
  
  // Show preview container
  previewContainer.style.display = 'flex';
  
  // Add animation
  previewContainer.classList.add('animate-fadeIn');
}

// Close preview
function closePreview() {
  previewContainer.style.display = 'none';
  previewContainer.classList.remove('animate-fadeIn');
}

// Add a new quote
function addQuote(event) {
  event.preventDefault();
  
  // Get values from form
  const quoteText = quoteTextInput.value.trim();
  const quoteAuthor = quoteAuthorInput.value.trim() || 'Unknown';
  
  if (!quoteText) {
    alert('Please enter a quote');
    return;
  }
  
  // Get existing custom quotes
  const customQuotes = getCustomQuotes();
  
  // Check if quote already exists
  const quoteExists = customQuotes.some(quote => 
    quote.text === quoteText && quote.author === quoteAuthor
  );
  
  if (quoteExists) {
    alert('This quote already exists in your collection!');
    return;
  }
  
  // Add new quote
  customQuotes.push({
    text: quoteText,
    author: quoteAuthor,
    isCustom: true,
    timestamp: new Date().getTime()
  });
  
  // Save updated quotes
  saveCustomQuotes(customQuotes);
  
  // Reset form
  quoteForm.reset();
  
  // Close preview if open
  closePreview();
  
  // Show success message
  successMessage.style.display = 'flex';
}

// Close success message
function closeSuccess() {
  successMessage.style.display = 'none';
}

// Event Listeners
previewBtn.addEventListener('click', showPreview);
closePreviewBtn.addEventListener('click', closePreview);
quoteForm.addEventListener('submit', addQuote);
closeSuccessBtn.addEventListener('click', closeSuccess); 