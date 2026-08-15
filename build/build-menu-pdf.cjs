const { chromium } = require('playwright');
const fs = require('fs');
const menuDoc = fs.readFileSync('./menu_doc.html','utf8');

const EMBLEM = `<svg viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
 <circle cx="40" cy="40" r="38" stroke-width="1.5"/><circle cx="40" cy="40" r="33" stroke-width="0.7"/>
 <ellipse cx="40" cy="19.2" rx="2.1" ry="3.4" fill="currentColor" stroke="none"/>
 <path d="M40 31.2 C 35.2 23.2 30.4 24 28.8 30.4" stroke-width="3.3"/>
 <path d="M40 31.2 C 44.8 23.2 49.6 24 51.2 30.4" stroke-width="3.3"/>
 <rect x="22.4" y="37.2" width="35.2" height="4" rx="2" fill="currentColor" stroke="none"/>
 <path d="M30.4 40.8 A 9.6 9.6 0 0 0 49.6 40.8" stroke-width="3.3"/>
 <path d="M36.4 57.6 L 40 51.2 L 43.6 57.6 Z" fill="currentColor" stroke="none"/>
 <rect x="26.4" y="60.4" width="27.2" height="4" rx="2" fill="currentColor" stroke="none"/></svg>`;

/* ---- simple full-page border: two gold lines with curved corners (mm on a 210x297 A4 canvas) ---- */
const BG_='#d9b641';
const BORDER = `<svg class="border" viewBox="0 0 210 297" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">`
   + `<rect x="9" y="9" width="192" height="279" rx="9" ry="9" fill="none" stroke="${BG_}" stroke-width="0.6"/>`
   + `<rect x="11.4" y="11.4" width="187.2" height="274.2" rx="7" ry="7" fill="none" stroke="${BG_}" stroke-width="0.4"/>`
   + `</svg>`;

const CSS = `
@page { size:A4; margin:0; }
*{ box-sizing:border-box; margin:0; padding:0; }
html{ background:#180309; }
body{ -webkit-print-color-adjust:exact; print-color-adjust:exact; color:#f2e6d2; background:transparent;
  font-family:'EB Garamond',Georgia,serif; font-size:11.5px; line-height:1.5; }
.page-bg{ position:fixed; inset:0; z-index:0;
  background:radial-gradient(115% 80% at 50% -6%, #3c0918 0%, #27060f 48%, #180309 100%); }
.wm{ position:fixed; left:50%; top:50%; width:135mm; height:135mm; transform:translate(-50%,-50%); z-index:0; color:#d4af37; opacity:.045; }
.wm svg{ width:100%; height:100%; }
/* full-bleed page: ornamental gold + emerald jewel border, drawn as a vector overlay */
.border{ position:fixed; inset:0; z-index:0; width:210mm; height:297mm; pointer-events:none; }
.gold{ color:#e8c66a; } .goldhi{ color:#f2dc95; }

/* ---------- COVER ---------- */
.cover{ position:relative; z-index:1; min-height:297mm; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; page-break-after:always; padding:20mm 16mm; }
.cover .emb{ width:34mm; height:34mm; color:#f2dc95; margin-bottom:9mm; }
.cover .brand-sc{ font-family:'EB Garamond SC','EB Garamond',serif; font-size:12.5px; letter-spacing:.34em; text-transform:uppercase; color:#f2dc95; }
.cover .rule{ width:56mm; height:1px; margin:6mm 0; background:linear-gradient(90deg,transparent,#d4af37 20%,#f5e08f 50%,#d4af37 80%,transparent); position:relative; }
.cover .rule::after{ content:""; position:absolute; left:50%; top:50%; width:6px; height:6px; background:#f5e08f; transform:translate(-50%,-50%) rotate(45deg); }
.cover .title{ font-family:'EB Garamond',serif; font-weight:700; font-size:50px; line-height:1.04; color:#eccd76; letter-spacing:.005em; }
.cover .title em{ font-style:italic; color:#f2dc95; }
.cover .sub{ font-family:'EB Garamond SC','EB Garamond',serif; letter-spacing:.28em; text-transform:uppercase; font-size:12px; color:#efe4d3; margin-top:8mm; }
.cover .tag{ font-style:italic; font-size:15px; color:rgba(242,230,210,.82); margin-top:3.5mm; }
.cover .cuis{ margin-top:11mm; font-family:'EB Garamond SC','EB Garamond',serif; letter-spacing:.16em; text-transform:uppercase; font-size:9.5px; color:rgba(242,230,210,.66); }
.cover .foot{ margin-top:13mm; }
.cover .est{ font-style:italic; color:#e8c66a; font-size:13px; letter-spacing:.03em; }
.cover .ph{ margin-top:3mm; font-size:13px; color:rgba(242,230,210,.85); letter-spacing:.04em; }

/* ---------- SECTIONS ---------- */
.menu-intro{ display:none !important; }
.content{ position:relative; z-index:1; width:100%; border-collapse:collapse; }
.content .vpad{ height:13mm; } /* thead/tfoot spacer repeats on every page → keeps content off the border */
.content .cell{ padding:0 15mm; vertical-align:top; }
.menu-sec{ break-inside:avoid; border:1px solid rgba(212,175,55,.45); border-radius:3mm; padding:4mm 6mm 4.5mm; margin-bottom:6mm; background:linear-gradient(180deg,rgba(212,175,55,.05),rgba(212,175,55,.008)); box-shadow:inset 0 0 0 .4mm rgba(212,175,55,.10); }
.menu-sec:first-child{ margin-top:0; }
.menu-sec-title{ display:flex; align-items:center; justify-content:center; gap:5mm; text-align:center;
  font-family:'EB Garamond SC','EB Garamond',serif; font-size:12.5px; font-weight:600; letter-spacing:.16em; text-transform:uppercase; color:#f2dc95; margin-bottom:3.5mm; break-after:avoid; }
.menu-sec-title::before,.menu-sec-title::after{ content:""; flex:0 0 15mm; height:1px; background:linear-gradient(90deg,transparent,#a97c1f); }
.menu-sec-title::after{ background:linear-gradient(90deg,#a97c1f,transparent); }
.menu-cols{ column-count:auto !important; display:grid; grid-template-columns:1fr 1fr; gap:3mm 9mm; }
.menu-cols.solo{ grid-template-columns:1fr; max-width:82mm; margin:0 auto; }
.menu-cat{ background:none !important; border:none !important; box-shadow:none !important; padding:0 !important; break-inside:avoid; }
.menu-cat h5{ font-family:'EB Garamond',serif; font-weight:700; font-size:13.5px; color:#eccd76 !important; -webkit-text-fill-color:#eccd76 !important; background:none !important; letter-spacing:.01em; margin-bottom:1.5mm; padding-bottom:1mm; border-bottom:.7px solid rgba(212,175,55,.32); display:flex; align-items:center; gap:2mm; }
.menu-cat h5::before{ content:""; flex:0 0 auto; width:5px; height:5px; background:#d4af37; transform:rotate(45deg); }
.menu-cat ul{ list-style:none; }
.menu-cat li{ position:relative; padding-left:8px; color:rgba(242,230,210,.9); font-size:11px; line-height:1.4; }
.menu-cat li::before{ content:""; position:absolute; left:0; top:.72em; width:3px; height:3px; background:rgba(212,175,55,.85); transform:rotate(45deg); }
.menu-cat .note{ color:rgba(242,230,210,.5); font-style:italic; font-size:9.5px; margin-top:1.4mm; padding-left:9px; line-height:1.4; }

/* ---------- THALI ---------- */
.menu-thali{ break-inside:avoid; margin-top:2mm !important; border:none !important; padding:2mm 0 0 !important; background:transparent !important; }
.menu-thali .t-head{ text-align:center; margin-bottom:5mm; }
.menu-thali .t-title{ font-family:'EB Garamond',serif; font-size:25px; font-weight:700; color:#eccd76 !important; -webkit-text-fill-color:#eccd76 !important; background:none !important; }
.menu-thali .t-sub{ font-style:italic; color:rgba(242,230,210,.72); margin-top:2mm; font-size:12px; }
.menu-thali ul{ column-count:2; column-gap:14mm; list-style:none; margin-top:2mm; }
.menu-thali li{ position:relative; padding-left:10px; color:rgba(242,230,210,.9); font-size:11.5px; line-height:1.85; break-inside:avoid; }
.menu-thali li::before{ content:""; position:absolute; left:0; top:.75em; width:3.5px; height:3.5px; background:#d4af37; transform:rotate(45deg); }
.menu-thali .t-note{ text-align:center; font-style:italic; color:rgba(242,230,210,.6); font-size:10.5px; margin-top:5mm; }

/* ---------- BACK ---------- */
.backpage{ position:relative; z-index:1; min-height:297mm; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; page-break-before:always; padding:20mm 16mm; }
.backpage .emb{ width:22mm; height:22mm; color:#f2dc95; margin-bottom:7mm; }
.backpage .ty{ font-family:'EB Garamond',serif; font-style:italic; font-size:34px; color:#eccd76; }
.backpage .msg{ max-width:120mm; margin-top:5mm; font-size:14px; color:rgba(242,230,210,.82); line-height:1.6; }
.backpage .rule{ width:50mm; height:1px; margin:9mm 0; background:linear-gradient(90deg,transparent,#d4af37,transparent); }
.backpage .lbl{ font-family:'EB Garamond SC','EB Garamond',serif; letter-spacing:.22em; text-transform:uppercase; font-size:9px; color:#f2dc95; margin-bottom:1.5mm; }
.backpage .val{ font-size:13.5px; color:rgba(242,230,210,.9); margin-bottom:5mm; }
.backpage .cuis{ margin-top:6mm; font-family:'EB Garamond SC','EB Garamond',serif; letter-spacing:.16em; text-transform:uppercase; font-size:9.5px; color:rgba(242,230,210,.6); }
`;

const cover = `<section class="cover">
  <div class="emb">${EMBLEM}</div>
  <div class="brand-sc">Radha Madhav Caterers</div>
  <div class="rule"></div>
  <div class="title">Pure Veg <em>Menu</em></div>
  <div class="sub">A Feast for Every Celebration</div>
  <div class="tag">(With &amp; Without Onion Garlic)</div>
  <div class="cuis">Multi-Cuisine &nbsp;&bull;&nbsp; Odia Specialities &nbsp;&bull;&nbsp; Chinese &amp; Tandoor</div>
  <div class="foot">
    <div class="est">Serving Excellence Since 1995</div>
    <div class="ph">+91 76848 91732 &nbsp;&bull;&nbsp; +91 99377 53507</div>
  </div>
</section>`;

const back = `<section class="backpage">
  <div class="emb">${EMBLEM}</div>
  <div class="ty">With Gratitude</div>
  <div class="msg">Thank you for choosing Radha Madhav Caterers. It would be our honour to make your next celebration truly memorable.</div>
  <div class="rule"></div>
  <div class="lbl">Reservations</div>
  <div class="val">+91 76848 91732 &nbsp;&bull;&nbsp; +91 99377 53507</div>
  <div class="lbl">Address</div>
  <div class="val">Radhamadhav Caterers, Sai Mandir, Near Gate 1 of Kalinga Stadium, Bhubaneshwar &ndash; 751012, Odisha</div>
  <div class="cuis">Pure Vegetarian &nbsp;&bull;&nbsp; With &amp; Without Onion Garlic</div>
</section>`;

(async () => {
  const b = await chromium.launch({ args:['--use-gl=swiftshader'] });
  const p = await (await b.newContext()).newPage();
  const html = '<!doctype html><html><head><meta charset="utf-8"><style>'+CSS+'</style></head><body>'
    + '<div class="page-bg"></div><div class="wm">'+EMBLEM+'</div>'+BORDER
    + cover
    + '<table class="content"><thead><tr><td class="vpad"></td></tr></thead>'
    + '<tbody><tr><td class="cell">'+menuDoc+'</td></tr></tbody>'
    + '<tfoot><tr><td class="vpad"></td></tr></tfoot></table>'
    + back + '</body></html>';
  await p.setContent(html, { waitUntil:'load' });
  await p.evaluate(()=>document.fonts.ready);
  await p.waitForTimeout(500);
  await p.pdf({ path:'../Radha-Madhav-Caterers-Menu.pdf', format:'A4', printBackground:true, preferCSSPageSize:true });
  await b.close();
  console.log('PDF bytes:', fs.statSync('../Radha-Madhav-Caterers-Menu.pdf').size);
})();
