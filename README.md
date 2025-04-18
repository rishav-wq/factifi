# Rishav Raj
# r62599446@gmail.com

# Factifi Mock Chrome Extension & API

This project contains a simple Chrome extension and a mock backend API to demonstrate a basic fact-checking workflow. The extension allows users to click a button in their browser, extract text from the current webpage, send it to the mock API, and display a simulated confidence score and citations in the extension's popup.

## Project Structure


factifi-mock/
├── chrome-extension/
│   ├── manifest.json         # Extension configuration
│   ├── popup.html            # Popup UI structure
│   ├── popup.css             # Popup UI styling
│   ├── popup.js              # Popup logic and interaction
│   ├── background.js         # Handles script injection and API calls
│   └── images/               # Folder for icons
│       ├── icon16.png        # (Create this)
│       ├── icon48.png        # (Create this)
│       └── icon128.png       # (Create this)
├── backend-api/
│   ├── app.py                # Flask API code
│   └── requirements.txt      # Python dependencies
└── README.md                 # This file


*(Note: You need to create the `images` folder and add placeholder or actual `.png` icons with the specified names and sizes.)*

## Setup and Running

### 1. Backend API (Flask)

a.  **Navigate to the `backend-api` directory:**
    ```bash
    cd backend-api
    ```
b.  **Create a virtual environment (recommended):**
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows use `venv\Scripts\activate`
    ```
c.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```
d.  **Run the Flask app:**
    ```bash
    flask run
    ```
    The API should now be running at `http://127.0.0.1:5000`. You will see output in your terminal indicating it's running. Keep this terminal open.

### 2. Chrome Extension

a.  **Open Google Chrome.**
b.  **Go to the Extension Management page:** Type `chrome://extensions` in your address bar and press Enter.
c.  **Enable Developer Mode:** Toggle the switch in the top-right corner.
d.  **Load the extension:**
    * Click the "Load unpacked" button.
    * Navigate to and select the `chrome-extension` folder within your `factifi-mock` project directory.
e.  **Pin the Extension:** Find the "Factifi Mock Checker" extension in your toolbar (you might need to click the puzzle piece icon) and click the pin icon to keep it visible.

## How to Use

1.  **Ensure the Flask API is running** (see step 1d above).
2.  **Navigate to any webpage** (e.g., a news article, Wikipedia page). Avoid internal Chrome pages (`chrome://...`) or the Chrome Web Store, as extensions have limited access there.
3.  **Click the Factifi Mock Checker icon** in your Chrome toolbar.
4.  **Click the "Check This Page" button** in the popup.
5.  The popup will briefly show "Checking..." and then display the mock "Confidence Score" and "Citations" received from the local Flask API.
6.  Use the **toggle switch** in the popup header to switch between light and dark modes. The preference is saved.
7.  Use the **refresh button** (🔄) to trigger the check again for the current page.

## Assumptions and Limitations

* **Mock API:** The backend API does *not* perform any real analysis. It returns randomly generated scores and citations for demonstration purposes.
* **Text Extraction:** The extension uses `document.body.innerText` for text extraction. This is a basic method and might not optimally capture the main content on all webpage layouts. More sophisticated libraries like Mozilla's Readability.js could be used for better results.
* **Error Handling:** Basic error handling is included, but complex network issues or edge cases might not be fully covered. Error messages are displayed in the popup.
* **Security:** The Flask API uses CORS with `*` (allow all origins) for simplicity during development. In a real application, you should restrict this to your specific Chrome extension's ID (`chrome-extension://YOUR_EXTENSION_ID`). The `host_permissions` in `manifest.json` should also ideally be more specific if the API wasn't running locally.
* **Icons:** Placeholder icons need to be created in the `images` folder.
