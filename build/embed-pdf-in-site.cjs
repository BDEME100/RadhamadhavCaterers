const fs = require('fs');
const pdf = fs.readFileSync('../Radha-Madhav-Caterers-Menu.pdf');
const b64 = pdf.toString('base64');
let html = fs.readFileSync('../index.html', 'utf8');
const before = html.length;
const matches = html.match(/data:application\/pdf;base64,[A-Za-z0-9+/=]*/g) || [];
if (matches.length !== 1) { console.error('EXPECTED 1 pdf data-uri, found', matches.length); process.exit(1); }
html = html.replace(/data:application\/pdf;base64,[A-Za-z0-9+/=]*/, 'data:application/pdf;base64,' + b64);
fs.writeFileSync('../index.html', html);
console.log('embedded PDF | pdf KB:', Math.round(pdf.length/1024), '| b64 len:', b64.length, '| html', before, '->', html.length);
