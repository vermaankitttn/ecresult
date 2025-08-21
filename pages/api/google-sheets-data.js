import { google } from 'googleapis';

// Google Sheets configuration
const SPREADSHEET_URL = process.env.GOOGLE_SHEETS_URL || 'https://docs.google.com/spreadsheets/d/1wQrOseeikbaJnF3_twiuI-FmSKo9tLTly02eFTCCLGQ/edit?gid=905796284#gid=905796284';

// Extract spreadsheet ID from URL
const SPREADSHEET_ID = SPREADSHEET_URL.match(/\/d\/([a-zA-Z0-9-_]+)/)?.[1];

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (!SPREADSHEET_ID) {
    console.error('Invalid Google Sheets URL');
    return res.status(500).json({ error: 'Invalid Google Sheets configuration' });
  }

  try {
    // Check if all required environment variables are present
    const requiredEnvVars = ['GOOGLE_PROJECT_ID', 'GOOGLE_PRIVATE_KEY', 'GOOGLE_CLIENT_EMAIL'];
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }

    // Create credentials object from environment variables
    const credentials = {
      type: 'service_account',
      project_id: process.env.GOOGLE_PROJECT_ID,
      private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'), // Handle escaped newlines
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      client_id: process.env.GOOGLE_CLIENT_ID,
      auth_uri: process.env.GOOGLE_AUTH_URI || 'https://accounts.google.com/o/oauth2/auth',
      token_uri: process.env.GOOGLE_TOKEN_URI || 'https://oauth2.googleapis.com/token',
      auth_provider_x509_cert_url: process.env.GOOGLE_AUTH_PROVIDER_CERT_URL || 'https://www.googleapis.com/oauth2/v1/certs',
      client_x509_cert_url: process.env.GOOGLE_CLIENT_CERT_URL,
      universe_domain: process.env.GOOGLE_UNIVERSE_DOMAIN || 'googleapis.com'
    };

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    
    // Get the sheet data
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Display!A2:K', // Reading from Display sheet
    });

    const rows = response.data.values;
    
    if (!rows || rows.length === 0) {
      return res.status(200).json([]);
    }

    // Transform the data to match the expected format
    const transformedData = rows
      .filter((row, index) => {
        // Filter out header rows and empty rows
        if (!row || row.length < 2) return false;
        if (row[1] === 'Candidate Name' || row[1] === 'CANDIDATE NAME') return false;
        if (row[1] === '' || row[1] === null || row[1] === undefined) return false;
        return true;
      })
      .map((row, index) => {
        // Assuming the columns are in this order:
        // S.No, Candidate Name, Tower, Flat#, 920, 1005, 1165, 1285, 1670, Total Vote Count, Total Vote Value
        return {
          id: index + 1,
          name: row[1] || `Candidate ${index + 1}`,
          flat: row[3] || 'N/A',
          totalCount: parseInt(row[9]) || 0,
          totalValue: parseFloat(row[10]) || 0.0,
          votes: {
            "920": parseInt(row[4]) || 0,
            "1005": parseInt(row[5]) || 0,
            "1165": parseInt(row[6]) || 0,
            "1285": parseInt(row[7]) || 0,
            "1670": parseInt(row[8]) || 0
          },
          position: index + 1
        };
      });

    // Sort by total value in descending order
    transformedData.sort((a, b) => b.totalValue - a.totalValue);
    
    // Update positions after sorting
    transformedData.forEach((candidate, index) => {
      candidate.position = index + 1;
    });

    res.status(200).json(transformedData);
  } catch (error) {
    console.error('Error fetching Google Sheets data:', error);
    res.status(500).json({ 
      error: 'Failed to fetch data from Google Sheets',
      details: error.message 
    });
  }
}