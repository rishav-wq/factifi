// URL of your mock backend API
const API_URL = 'http://127.0.0.1:5000/verify'; // Make sure this matches your Flask API address

// Listen for messages from the popup script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "checkPage") {
        console.log("Background: Received checkPage request.");

        // 1. Get the current active tab
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (chrome.runtime.lastError || !tabs || tabs.length === 0) {
                console.error("Background: Error getting active tab:", chrome.runtime.lastError?.message || "No active tab found.");
                sendResponse({ error: "Could not get active tab." });
                return; // Stop execution if no tab found
            }

            const currentTab = tabs[0];
            if (!currentTab.id) {
                 console.error("Background: Active tab has no ID.");
                 sendResponse({ error: "Active tab has no ID." });
                 return;
            }

            console.log("Background: Current tab ID:", currentTab.id);

            // 2. Inject script to extract text content
            chrome.scripting.executeScript({
                target: { tabId: currentTab.id },
                function: extractTextContent, // The function to execute in the tab
            }, (injectionResults) => {
                // Check for errors during injection or execution
                if (chrome.runtime.lastError || !injectionResults || injectionResults.length === 0) {
                    console.error("Background: Script injection failed:", chrome.runtime.lastError?.message || "No result from script.");
                    // Try to determine the cause of the error
                    let errorMessage = "Failed to extract text from page.";
                    if (currentTab.url?.startsWith('chrome://')) {
                        errorMessage = "Cannot run on internal Chrome pages.";
                    } else if (chrome.runtime.lastError?.message.includes('Cannot access contents of url')) {
                         errorMessage = "Cannot access this page's content (e.g., Chrome Web Store, file URLs).";
                    } else if (chrome.runtime.lastError) {
                        errorMessage = `Script injection error: ${chrome.runtime.lastError.message}`;
                    }
                    sendResponse({ error: errorMessage });
                    return;
                }

                // The result is an array, we expect one result object
                const extractedText = injectionResults[0].result;
                console.log("Background: Extracted text length:", extractedText?.length ?? 0);

                if (!extractedText) {
                    console.warn("Background: No text content found on the page.");
                    sendResponse({ error: "No text content found on the page." });
                    return;
                }

                // 3. Send text to the mock API
                callMockApi(extractedText)
                    .then(data => {
                        console.log("Background: API call successful, sending data to popup.");
                        sendResponse({ data: data }); // Send successful data back
                    })
                    .catch(error => {
                        console.error("Background: API call failed:", error);
                        sendResponse({ error: `API Error: ${error.message}` }); // Send error back
                    });
            });
        });

        return true; // Indicates that the response will be sent asynchronously
    }
});

// Function executed in the context of the webpage to extract text
function extractTextContent() {
    // Simple text extraction. Consider more robust methods like Readability.js for complex pages.
    return document.body.innerText;
}

// Async function to call the mock API
async function callMockApi(text) {
    console.log("Background: Calling API at", API_URL);
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: text }), // Send text in JSON body
        });

        if (!response.ok) {
            // Throw an error if the response status is not OK (e.g., 404, 500)
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json(); // Parse the JSON response
        console.log("Background: Received API response:", data);
        return data; // Return the parsed data

    } catch (error) {
        console.error("Background: Error during fetch:", error);
        // Re-throw the error to be caught by the caller in the message listener
        throw new Error(error.message || "Failed to fetch from API.");
    }
}

console.log("Background script loaded.");
