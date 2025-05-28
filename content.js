// Function to create a new file with the provided content
async function createFileWithContent(content) {
  try {
    // Create a blob with the content
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    // Create a download link
    const link = document.createElement('a');
    link.href = url;
    link.download = 'page-content.html';
    link.style.display = 'none';
    document.body.appendChild(link);
    
    // Trigger the download
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('Error creating file:', error);
    return false;
  }
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'readPage') {
    // Get the HTML content of the page
    const htmlContent = document.documentElement.outerHTML;
    sendResponse({ content: htmlContent });
  } else if (request.action === 'createFile') {
    const success = createFileWithContent(request.content);
    sendResponse({ success });
  }
  return true;
});
