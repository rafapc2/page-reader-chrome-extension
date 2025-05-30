document.addEventListener('DOMContentLoaded', function() {
  const readButton = document.getElementById('readButton');
  const contentDisplay = document.getElementById('contentDisplay');
  const pageTitle = document.getElementById('pageTitle');

  // Display page title when popup opens
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    if (tabs[0]) {
      pageTitle.textContent = `Title: ${tabs[0].title}`;
    }
  });

  const saveButton = document.getElementById('saveButton');

  // Add save button functionality
  saveButton.addEventListener('click', async () => {
    try {
      // Get the current active tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      // Send message to content script to read page content and create file
      const result = await chrome.tabs.sendMessage(tab.id, { action: 'readPage' });
      
      // Send message to content script to create file
      const success = await chrome.tabs.sendMessage(tab.id, { 
        action: 'createFile',
        content: result.content
      });
      
      if (success) {
        contentDisplay.innerHTML = `
          <div class="success">
            <p>File has been created and downloaded successfully!</p>
          </div>
        `;
      } else {
        contentDisplay.innerHTML = `
          <div class="error">
            <p>Failed to create file.</p>
          </div>
        `;
      }
    } catch (error) {
      contentDisplay.innerHTML = `
        <div class="error">
          <p><strong>Error saving content:</strong></p>
          <p>${error.message}</p>
        </div>
      `;
    }
  });

  readButton.addEventListener('click', async () => {
    try {
      // Get the current active tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      // Send message to content script to read page content
      const result = await chrome.tabs.sendMessage(tab.id, { action: 'readPage' });
      
      // Format and display the HTML content
      const formattedHtml = formatHtml(result.content);
      contentDisplay.innerHTML = `
        <div class="html-viewer">
          <pre>${formattedHtml}</pre>
        </div>
      `;
    } catch (error) {
      const errorDetails = {
        message: error.message || 'Unknown error',
        name: error.name || 'Error',
        stack: error.stack || 'Stack trace not available'
      };
      
      contentDisplay.innerHTML = `
        <div class="error">
          <p><strong>Error reading page content:</strong></p>
          <div class="error-info">
            <p><strong>Type:</strong> ${errorDetails.name}</p>
            <p><strong>Message:</strong> ${errorDetails.message}</p>
            <p><strong>Stack Trace:</strong></p>
            <pre class="stack-trace">${errorDetails.stack}</pre>
          </div>
        </div>
      `;
    }
  });

  // Function to format HTML for display
  function formatHtml(html) {
    // Escape HTML to prevent XSS
    return html.replace(/&/g, '&amp;')
               .replace(/</g, '&lt;')
               .replace(/>/g, '&gt;')
               .replace(/\n/g, '<br>')
               .replace(/\s{2}/g, '&nbsp;');
  }
});
