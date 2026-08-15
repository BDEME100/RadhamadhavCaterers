# Bookings → your spreadsheet (setup guide)

This connects the website's **Book Your Event** form to a Google Sheet. Every time
someone submits the form, a new row is added automatically — and you also get an
email copy. You can open or download that sheet as Excel (`.xlsx`) any time.

You only do this **once**. It's free. Takes about 5 minutes.

---

## Step 1 — Make the sheet

1. Go to **sheets.google.com** and create a **Blank spreadsheet**.
2. Name it something like **Radha Madhav Bookings**.
3. At the bottom, double-click the tab **Sheet1** and rename it to **Bookings**.
   (If you skip this, the script just uses the first tab — that's fine too.)

## Step 2 — Add the script

1. In that sheet, click **Extensions → Apps Script**.
2. Delete whatever sample code is shown.
3. Open the file **`booking-to-sheet.gs`** I sent you, copy **everything**, and
   paste it into the Apps Script editor.
4. Click the **Save** icon (💾).

## Step 3 — Deploy it as a web app

1. Click **Deploy → New deployment**.
2. Click the gear ⚙ next to "Select type" and choose **Web app**.
3. Set:
   - **Description:** Bookings (anything is fine)
   - **Execute as:** **Me**
   - **Who has access:** **Anyone**
4. Click **Deploy**.
5. It asks you to **authorize** — click **Authorize access**, pick your Google
   account, and on the "Google hasn't verified this app" screen click
   **Advanced → Go to (your project)** → **Allow**. (This is normal for your own
   scripts.)
6. Copy the **Web app URL** it gives you. It looks like:
   `https://script.google.com/macros/s/AKfy...../exec`

## Step 4 — Connect it to the website

Two easy options — pick one:

- **Easiest:** send me that Web app URL and I'll paste it into the site and send
  the finished file back.
- **Do it yourself:** open `index.html` in any text editor, use Find to locate
  `PASTE_YOUR_GOOGLE_APPS_SCRIPT_URL_HERE`, and replace just that text (keep the
  quotes) with your URL. Save.

## Step 5 — Test

Open the site, fill in the booking form, and submit. Within a few seconds a new
row should appear in your **Bookings** sheet, and an email copy arrives at
**radhamadhavcaterers@gmail.com**.

---

### Notes

- **Open in Excel:** in the Google Sheet, **File → Download → Microsoft Excel
  (.xlsx)** whenever you want an Excel copy. (A Google Sheet already works exactly
  like Excel in the browser.)
- **Turn off the email copy:** in the script, set `NOTIFY_EMAIL = '';`
- **Columns saved:** Timestamp, Name, Phone, Event Date, Guests, Package,
  Requirements.
- Until the URL is added, the form still works — it opens a pre-filled email to
  your Gmail instead, so you never miss a booking during setup.
- If you ever change the script, click **Deploy → Manage deployments → Edit ✏ →
  Version: New version → Deploy** so the changes go live (the URL stays the same).
