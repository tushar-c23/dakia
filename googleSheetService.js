const { google } = require('googleapis');
const sheets = google.sheets('v4');
require('dotenv').config();

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const GCLOUD_PROJECT = process.env.PROJECTID;


async function getAuthToken() {
    const auth = new google.auth.GoogleAuth({
        scopes: SCOPES,
        keyFile: './service_account_creds.json'
    });
    const authToken = await auth.getClient();
    return authToken;
}

async function getSpreadSheet({ spreadsheetId, auth }) {
    const res = await sheets.spreadsheets.get({
        spreadsheetId,
        auth,
    });
    return res;
}

async function getSpreadSheetValues({ spreadsheetId, auth, sheetName }) {
    const res = await sheets.spreadsheets.values.get({
        spreadsheetId,
        auth,
        range: sheetName
    });
    return res;
}

module.exports = {
    getAuthToken,
    getSpreadSheet,
    getSpreadSheetValues
}