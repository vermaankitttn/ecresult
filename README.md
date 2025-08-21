# EC Results Dashboard - React App

A React-based dashboard for displaying EC (Election Commission) results with automatic tab switching and real-time updates.

## Features

- 🏆 **Top 10 Candidates Tab** - Shows the leading candidates
- 📊 **Remaining Candidates Tab** - Shows candidates ranked 11+
- 🔄 **Automatic Tab Switching** - Switches between tabs every 10 seconds
- ⏰ **Auto-refresh** - Updates data every 60 seconds
- 🎨 **Responsive Design** - Works on desktop and mobile
- 🎯 **Color-coded Cards** - Green for top 10, red for remaining candidates

## Prerequisites

Before running this app, make sure you have:

- **Node.js** (version 14 or higher)
- **npm** (comes with Node.js)
- **Google Sheets API credentials** (configured via environment variables)

## Installation Steps

### 1. Install Dependencies

Open your terminal in the project directory and run:

```bash
npm install
```

This will install all the required dependencies listed in `package.json`.

### 2. Environment Variables Setup

1. **Copy the environment template:**
   ```bash
   cp .env.example .env
   ```

2. **Configure your Google Service Account credentials:**
   
   Open the `.env` file and replace the placeholder values with your actual Google Service Account credentials:

   ```env
   # Required credentials from your Google Service Account JSON
   GOOGLE_PROJECT_ID=your-actual-project-id
   GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_ACTUAL_PRIVATE_KEY\n-----END PRIVATE KEY-----"
   GOOGLE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
   
   # Optional: Update the Google Sheets URL if different
   GOOGLE_SHEETS_URL=https://docs.google.com/spreadsheets/d/YOUR_SPREADSHEET_ID/edit#gid=YOUR_SHEET_ID
   ```

   **Important Notes:**
   - Never commit the `.env` file to version control (it's already in `.gitignore`)
   - For the `GOOGLE_PRIVATE_KEY`, include the full key with `\n` characters for line breaks
   - Get these values from your Google Cloud Service Account JSON file

3. **Google Service Account Setup (if you don't have credentials yet):**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create or select a project
   - Enable the Google Sheets API
   - Create a Service Account and download the JSON credentials
   - Share your Google Sheet with the service account email address

### 3. Start the Full Application (Recommended)

Run the following command to start both the backend server and React frontend:

```bash
./start-full-app.sh
```

This will:
- Start the backend server on `http://localhost:5000`
- Start the React frontend on `http://localhost:3000`
- Connect to your Google Sheets data automatically

### 4. Alternative: Start Only Frontend (Mock Data)

If you want to run only the React app with mock data:

```bash
npm start
```

The app will automatically open in your default browser at `http://localhost:3000`.

## How It Works

### Automatic Tab Switching
- The app automatically switches between "Top 10 Candidates" and "Remaining Candidates" every **10 seconds**
- You can also manually switch tabs using the buttons in the sidebar
- A countdown timer shows when the next automatic switch will occur

### Data Display
- **Candidate Cards** show:
  - Candidate name and flat number
  - Profile photo (initials)
  - Total vote count and value
  - Individual vote counts for different categories (920, 1005, 1165, 1285, 1670)

### Color Coding
- **Top 10 candidates**: Light green background with dark green borders
- **Remaining candidates**: Light red background with dark red borders

## Project Structure

```
src/
├── components/
│   ├── CandidateCard.js      # Individual candidate card component
│   ├── CandidateCard.css     # Styles for candidate cards
│   ├── Sidebar.js           # Sidebar with controls and status
│   └── Sidebar.css          # Styles for sidebar
├── App.js                   # Main application component
├── App.css                  # Main application styles
├── index.js                 # React entry point
└── index.css                # Global styles
```

## Customization

### Changing Tab Switch Interval
To change how often tabs switch automatically, modify the interval in `src/App.js`:

```javascript
// Change from 10000ms (10 seconds) to your preferred interval
const interval = setInterval(() => {
  setActiveTab(prev => (prev + 1) % 2);
  setLastSwitch(Date.now());
}, 10000); // Change this value
```

### Changing Data Refresh Interval
To change how often data refreshes, modify the interval in `src/App.js`:

```javascript
// Change from 60000ms (60 seconds) to your preferred interval
const interval = setInterval(() => {
  setRefreshCount(prev => prev + 1);
  // Here you would typically fetch new data from your API
}, 60000); // Change this value
```

### Adding Real Data
Replace the `sampleData` array in `src/App.js` with your actual data from Google Sheets or any other source.

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Runs the test suite
- `npm eject` - Ejects from Create React App (not recommended)

## Browser Support

The app works in all modern browsers:
- Chrome
- Firefox
- Safari
- Edge

## Troubleshooting

### Missing Environment Variables
If you get an error about missing Google credentials, ensure you have:
1. Created the `.env` file from `.env.example`
2. Added all required environment variables (GOOGLE_PROJECT_ID, GOOGLE_PRIVATE_KEY, GOOGLE_CLIENT_EMAIL)
3. Formatted the private key correctly with `\n` characters

### Port Already in Use
If you get an error that port 3000 is already in use, the app will automatically suggest using a different port.

### Installation Issues
If you encounter issues during `npm install`, try:
```bash
npm cache clean --force
npm install
```

### Google Sheets API Issues
If you can't connect to Google Sheets:
1. Verify your service account has access to the spreadsheet
2. Check that the Google Sheets API is enabled in your Google Cloud project
3. Ensure the GOOGLE_SHEETS_URL points to the correct spreadsheet

### Performance Issues
If the app seems slow, check that you're using a modern browser and have sufficient RAM available.

## Deployment

To deploy the app to production:

1. Build the app:
   ```bash
   npm run build
   ```

2. The `build` folder will contain the production-ready files

3. Deploy the contents of the `build` folder to your web server

## Support

For issues or questions, please check the console for error messages and ensure all dependencies are properly installed.
