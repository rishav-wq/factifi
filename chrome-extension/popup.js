// Get references to UI elements
const checkButton = document.getElementById('check-button');
const refreshButton = document.getElementById('refresh-button');
const resultsDiv = document.getElementById('results');
const loadingDiv = document.getElementById('loading');
const errorMessageDiv = document.getElementById('error-message');
const confidenceScoreSpan = document.getElementById('confidence-score');
const citationsList = document.getElementById('citations-list');
const darkModeToggle = document.getElementById('dark-mode-toggle');

// --- Dark Mode ---

// Function to apply dark mode based on stored preference
function applyDarkModePreference() {
    chrome.storage.local.get(['darkModeEnabled'], (result) => {
        const enabled = result.darkModeEnabled || false; // Default to false if not set
        darkModeToggle.checked = enabled;
        if (enabled) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    });
}

// Event listener for the dark mode toggle
darkModeToggle.addEventListener('change', () => {
    const isEnabled = darkModeToggle.checked;
    if (isEnabled) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
    // Save the preference
    chrome.storage.local.set({ darkModeEnabled: isEnabled });
});

// Apply dark mode on popup load
applyDarkModePreference();

// --- Fact Checking Logic ---

// Function to initiate the fact-checking process
function performCheck() {
    // Show loading indicator, hide previous results/errors
    loadingDiv.style.display = 'block';
    resultsDiv.style.display = 'none';
    errorMessageDiv.style.display = 'none';
    checkButton.disabled = true; // Disable button while checking
    refreshButton.disabled = true;

    // Send a message to the background script to start the process
    chrome.runtime.sendMessage({ action: "checkPage" }, (response) => {
        // Re-enable buttons
        checkButton.disabled = false;
        refreshButton.disabled = false;
        loadingDiv.style.display = 'none'; // Hide loading

        // Check if the background script sent back data or an error
        if (chrome.runtime.lastError) {
            console.error("Error sending message:", chrome.runtime.lastError.message);
            showError("Error communicating with background script.");
            return;
        }

        if (response && response.error) {
            console.error("Error from background:", response.error);
            showError(response.error); // Show specific error from background
        } else if (response && response.data) {
            displayResults(response.data); // Display successful results
        } else {
            console.error("Invalid response from background script:", response);
            showError("Received invalid response from background.");
        }
    });
}

// Event listener for the "Check This Page" button
checkButton.addEventListener('click', performCheck);

// Event listener for the "Refresh" button
refreshButton.addEventListener('click', performCheck);


// Function to display the results received from the background script
function displayResults(data) {
    if (!data || typeof data.confidence_score === 'undefined' || !Array.isArray(data.citations)) {
        console.error("Invalid data format received:", data);
        showError("Received invalid data format from API.");
        return;
    }

    confidenceScoreSpan.textContent = data.confidence_score;
    citationsList.innerHTML = ''; // Clear previous citations

    if (data.citations.length === 0) {
        const li = document.createElement('li');
        li.textContent = 'No citations provided.';
        citationsList.appendChild(li);
    } else {
        data.citations.forEach(citation => {
            const li = document.createElement('li');
            li.textContent = citation;
            citationsList.appendChild(li);
        });
    }

    resultsDiv.style.display = 'block'; // Show the results section
    errorMessageDiv.style.display = 'none'; // Hide any previous error
}

// Function to display an error message
function showError(message) {
    errorMessageDiv.textContent = `Error: ${message || 'An unknown error occurred.'}`;
    errorMessageDiv.style.display = 'block'; // Show the error message section
    resultsDiv.style.display = 'none'; // Hide the results section
}

// Optional: Add placeholder icons (replace with actual image files)
// Create dummy icon files named icon16.png, icon48.png, icon128.png in an 'images' folder.
// You can use simple colored squares or download actual icons.
