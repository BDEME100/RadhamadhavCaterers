/**
 * Radha Madhav Caterers — Booking → Google Sheet
 * ------------------------------------------------
 * Receives booking submissions from the website and appends each one as a new
 * row in your Google Sheet. Also emails a copy to you for every booking.
 *
 * SETUP (one time — see the setup guide for screenshots/steps):
 *   1. Open the Google Sheet you want bookings saved to (or create a new one).
 *   2. Extensions → Apps Script. Delete any sample code, paste ALL of this file.
 *   3. (Optional) change NOTIFY_EMAIL below if you want notifications elsewhere.
 *   4. Deploy → New deployment → type "Web app".
 *        - Execute as: Me
 *        - Who has access: Anyone
 *      Click Deploy, authorise, and COPY the Web app URL.
 *   5. Put that URL into the website (BOOKING_ENDPOINT) — or send it to Claude.
 */

// Booking copies are emailed here too. Leave '' to turn email off.
var NOTIFY_EMAIL = 'radhamadhavcaterers@gmail.com';
// Tab name inside the spreadsheet where rows are written.
var SHEET_NAME = 'Bookings';

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(30000);

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];

    // Parse the incoming booking (JSON body, or form fields as a fallback).
    var data = {};
    if (e && e.postData && e.postData.contents) {
      try { data = JSON.parse(e.postData.contents); }
      catch (err) { data = (e.parameter || {}); }
    } else if (e && e.parameter) {
      data = e.parameter;
    }

    // Write a header row the first time.
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Timestamp', 'Name', 'Phone',
                       'Event Date', 'Guests', 'Package', 'Requirements']);
      sheet.getRange(1, 1, 1, 7).setFontWeight('bold');
      sheet.setFrozenRows(1);
    }

    var row = [
      new Date(),
      data.name || '',
      data.phone || '',
      data.date || '',
      data.guests || '',
      data.package || '',
      data.requirements || ''
    ];
    sheet.appendRow(row);

    // Email a copy of the booking (optional).
    if (NOTIFY_EMAIL) {
      try {
        var body =
          'New booking received via the website:\n\n' +
          'Name: ' + (data.name || '') + '\n' +
          'Phone: ' + (data.phone || '') + '\n' +
          'Event Date: ' + (data.date || '') + '\n' +
          'Guests: ' + (data.guests || '') + '\n' +
          'Package: ' + (data.package || '') + '\n' +
          'Requirements: ' + (data.requirements || '') + '\n\n' +
          'This booking has also been saved to your Google Sheet.';
        MailApp.sendEmail({
          to: NOTIFY_EMAIL,
          subject: 'New Booking — ' + (data.name || 'Website'),
          body: body
        });
      } catch (mailErr) { /* email is best-effort; the row is already saved */ }
    }

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', message: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    try { lock.releaseLock(); } catch (e2) {}
  }
}

// Lets you open the Web app URL in a browser to confirm it's live.
function doGet() {
  return ContentService.createTextOutput(
    'Radha Madhav Caterers booking endpoint is live. Bookings POSTed here are saved to the sheet.'
  );
}
