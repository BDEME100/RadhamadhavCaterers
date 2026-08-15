# Radha Madhav Caterers — Website

A single‑page website for **Radha Madhav Caterers**, a premium pure‑vegetarian catering service in Bhubaneswar, Odisha (serving since 1995). Built as one self‑contained HTML file — animated hero background, glassmorphism UI, an interactive full menu, packages, a bookings form wired to Google Sheets, a downloadable menu PDF, and a Google Maps location.

## What's here

```
index.html                       The complete website — self-contained (all CSS/JS inline,
                                 the menu PDF is embedded so it works with no server).
Radha-Madhav-Caterers-Menu.pdf   The downloadable menu (also embedded in index.html).

backend/
  booking-to-sheet.gs            Google Apps Script: saves each booking to a Google Sheet
                                 and emails a copy.
  Booking-to-Excel-Setup.md      Step-by-step setup guide for the above.

build/
  menu_doc.html                  Source content for the menu PDF (edit dishes here).
  build-menu-pdf.cjs             Renders menu_doc.html to Radha-Madhav-Caterers-Menu.pdf.
  embed-pdf-in-site.cjs          Embeds the built PDF into index.html's Download button.
```

## Deploy the site

The site is a single static file — host `index.html` anywhere:

- **GitHub Pages:** push this repo, then in the repo go to **Settings → Pages → Build and deployment → Deploy from a branch**, pick `main` / `root`, and save. Your site goes live at `https://<your-username>.github.io/<repo-name>/`.
- **Any static host** (Netlify, Vercel, cPanel, Hostinger, etc.): just upload `index.html`.

Nothing needs to be built to deploy — `index.html` already contains everything.

## Bookings → Google Sheet

The **Book Your Event** form posts to a Google Apps Script web app, which appends each booking as a row in a Google Sheet and emails a copy. Full instructions are in [`backend/Booking-to-Excel-Setup.md`](backend/Booking-to-Excel-Setup.md).

The deployed web‑app URL lives in `index.html` as `BOOKING_ENDPOINT`. This is a public endpoint by design (the form calls it from the browser), so it is safe to have in the code. If the form URL ever changes, update that one value.

## Rebuilding the menu PDF

Only needed if you change the menu. From the `build/` folder:

```bash
cd build
npm install playwright         # first time only
node build-menu-pdf.cjs        # menu_doc.html  ->  ../Radha-Madhav-Caterers-Menu.pdf
node embed-pdf-in-site.cjs     # embeds the new PDF into ../index.html
```

Edit dishes in `build/menu_doc.html`, then run the two commands above.

## Notes

- Pure‑vegetarian menu; dish photos in the gallery are royalty‑free stock (Pexels), free for commercial use.
- Contact: +91 76848 91732 · +91 99377 53507
