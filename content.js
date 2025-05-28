// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'readPage') {
    // Get the HTML content of the page
    const htmlContent = document.documentElement.outerHTML;
    sendResponse({ content: htmlContent });
  }
  return true;
});
