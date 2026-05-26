const PDFDocument = require('pdfkit');

// ---------- helpers ----------
function inr(n) {
  const v = Number(n) || 0;
  return `Rs. ${v.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function fmtDate(d) {
  if (!d) return '—';
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return String(d);
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function nights(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 0;
  const a = new Date(checkIn);
  const b = new Date(checkOut);
  if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime())) return 0;
  return Math.max(1, Math.round((b - a) / (1000 * 60 * 60 * 24)));
}

// Convert number to Indian-words (paise-aware).
function numToWords(n) {
  const num = Math.round((Number(n) || 0) * 100) / 100;
  if (num === 0) return 'Zero Rupees Only';

  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const twoDigits = (x) => {
    if (x < 20) return ones[x];
    const t = Math.floor(x / 10);
    const o = x % 10;
    return tens[t] + (o ? ' ' + ones[o] : '');
  };

  const threeDigits = (x) => {
    const h = Math.floor(x / 100);
    const rest = x % 100;
    return (h ? ones[h] + ' Hundred' + (rest ? ' ' : '') : '') + (rest ? twoDigits(rest) : '');
  };

  let rupees = Math.floor(num);
  const paise = Math.round((num - rupees) * 100);

  if (rupees === 0) {
    return paise > 0 ? `${twoDigits(paise)} Paise Only` : 'Zero Rupees Only';
  }

  const parts = [];
  const crore = Math.floor(rupees / 10000000); rupees %= 10000000;
  const lakh  = Math.floor(rupees / 100000);   rupees %= 100000;
  const thousand = Math.floor(rupees / 1000);  rupees %= 1000;
  const hundred = rupees;

  if (crore) parts.push(threeDigits(crore) + ' Crore');
  if (lakh)  parts.push(threeDigits(lakh) + ' Lakh');
  if (thousand) parts.push(threeDigits(thousand) + ' Thousand');
  if (hundred)  parts.push(threeDigits(hundred));

  let words = parts.join(' ').trim() + ' Rupees';
  if (paise) words += ` and ${twoDigits(paise)} Paise`;
  return words + ' Only';
}

// ---------- main ----------
function buildInvoicePdf(invoice, opts = {}) {
  const doc = new PDFDocument({ size: 'A4', margin: 40 });

  // ---- theme ----
  const accent = '#244cf5';
  const ink900 = '#11152a';
  const ink700 = '#2f3852';
  const ink500 = '#566388';
  const ink300 = '#b1bad1';
  const ink100 = '#eceef6';
  const ink50  = '#f6f7fb';
  const pageW  = doc.page.width;
  const margin = 40;
  const contentW = pageW - margin * 2;

  // ---- hotel info ----
  const hotel = {
    name:    opts.hotelName    || 'Opulent Spire Hotel',
    address: opts.hotelAddress || '12 Crown Avenue, Hospitality Lane',
    city:    opts.hotelCity    || 'Bengaluru, Karnataka 560001',
    country: opts.hotelCountry || 'India',
    phone:   opts.hotelPhone   || '+91 80 4567 8900',
    email:   opts.hotelEmail   || 'reservations@opulentspire.in',
    web:     opts.hotelWeb     || 'www.opulentspire.in',
    gstin:   opts.hotelGstin   || '29AAACO1234X1ZA',
    pan:     opts.hotelPan     || 'AAACO1234X',
    stateCode: opts.hotelStateCode || '29',
  };

  // ---- compute ----
  const checkIn  = invoice.checkIn || invoice.createdAt;
  const checkOut = invoice.checkOut;
  const stayNights = nights(checkIn, checkOut);

  // Use stored lines, or synthesise a single line from totals
  let lines = Array.isArray(invoice.lines) && invoice.lines.length
    ? invoice.lines.map((l) => ({
        description: l.description,
        qty: l.qty || 1,
        rate: l.rate || 0,
        amount: l.amount || (l.rate || 0) * (l.qty || 1),
      }))
    : [];
  if (lines.length === 0) {
    const total = Number(invoice.total) || 0;
    const qty = stayNights || 1;
    lines = [{
      description: invoice.description || `Stay charges${invoice.room ? ` · Room ${invoice.room}` : ''}`,
      qty,
      rate: qty ? total / qty : total,
      amount: total,
    }];
  }

  const subtotal = lines.reduce((a, l) => a + (l.amount || 0), 0);
  const discount = Number(invoice.discount) || 0;
  const taxable  = Math.max(0, subtotal - discount);
  const gstTotal = Number(invoice.gst) || 0;
  const cgst = gstTotal / 2;
  const sgst = gstTotal / 2;
  const grand = Number(invoice.total) ? Number(invoice.total) + gstTotal : taxable + gstTotal;
  const paid   = Number(invoice.paid) || (invoice.status === 'Paid' ? grand : invoice.status === 'Partial' ? grand / 2 : 0);
  const balance = Math.max(0, grand - paid);

  // ====== HEADER BAND ======
  doc.rect(0, 0, pageW, 110).fillColor(ink900).fill();
  // accent strip
  doc.rect(0, 110, pageW, 3).fillColor(accent).fill();

  // Hotel block (left)
  doc.fillColor('#fff').font('Helvetica-Bold').fontSize(20).text(hotel.name, margin, 30);
  doc.font('Helvetica').fontSize(9).fillColor(ink300);
  doc.text(hotel.address, margin, 56);
  doc.text(`${hotel.city} · ${hotel.country}`, margin, 69);
  doc.text(`Tel ${hotel.phone}  ·  ${hotel.email}`, margin, 82);

  // Invoice block (right)
  const rightX = pageW - margin - 200;
  doc.fillColor('#fff').font('Helvetica-Bold').fontSize(26).text('TAX INVOICE', rightX, 28, { width: 200, align: 'right' });
  doc.font('Helvetica').fontSize(9).fillColor(ink300);
  doc.text(`# ${invoice.code || invoice._id}`, rightX, 60, { width: 200, align: 'right' });
  doc.text(`Date: ${fmtDate(invoice.createdAt || Date.now())}`, rightX, 73, { width: 200, align: 'right' });
  doc.text(`GSTIN: ${hotel.gstin}`, rightX, 86, { width: 200, align: 'right' });

  // ====== STATUS PILL ======
  let y = 130;
  const status = invoice.status || 'Due';
  const statusColor = status === 'Paid' ? '#10b981' : status === 'Partial' ? '#f59e0b' : '#ef4444';
  doc.roundedRect(margin, y, 90, 22, 6).fillColor(statusColor).fill();
  doc.fillColor('#fff').font('Helvetica-Bold').fontSize(10)
     .text(status.toUpperCase(), margin, y + 6, { width: 90, align: 'center' });

  // Place of supply
  doc.fillColor(ink500).font('Helvetica').fontSize(9)
     .text(`Place of Supply: ${invoice.placeOfSupply || `Karnataka (${hotel.stateCode})`}`, margin + 100, y + 7);
  doc.fillColor(ink500).fontSize(9)
     .text('Reverse Charge: No', rightX, y + 7, { width: 200, align: 'right' });

  // ====== BILL TO + STAY DETAILS (two columns) ======
  y = 170;
  const colW = (contentW - 20) / 2;

  // Left card - Bill To
  doc.roundedRect(margin, y, colW, 100, 8).fillColor(ink50).fill();
  doc.fillColor(ink500).font('Helvetica-Bold').fontSize(8).text('BILL TO', margin + 14, y + 12);
  doc.fillColor(ink900).font('Helvetica-Bold').fontSize(13).text(invoice.guest || '—', margin + 14, y + 26);
  doc.fillColor(ink700).font('Helvetica').fontSize(9);
  if (invoice.guestEmail) doc.text(invoice.guestEmail, margin + 14, y + 48);
  if (invoice.guestPhone) doc.text(invoice.guestPhone, margin + 14, y + 62);
  if (invoice.guestGstin) doc.text(`GSTIN: ${invoice.guestGstin}`, margin + 14, y + 76);
  else doc.text('Walk-in guest', margin + 14, y + 48);

  // Right card - Stay Details
  const rcX = margin + colW + 20;
  doc.roundedRect(rcX, y, colW, 100, 8).fillColor(ink50).fill();
  doc.fillColor(ink500).font('Helvetica-Bold').fontSize(8).text('STAY DETAILS', rcX + 14, y + 12);

  const stayRow = (k, v, yy) => {
    doc.fillColor(ink500).font('Helvetica').fontSize(9).text(k, rcX + 14, yy);
    doc.fillColor(ink900).font('Helvetica-Bold').fontSize(9).text(v, rcX + 14 + 90, yy);
  };
  stayRow('Booking',    String(invoice.bookingCode || invoice.code || '—'), y + 30);
  stayRow('Room',       invoice.room || '—',                              y + 46);
  stayRow('Check-in',   fmtDate(checkIn),                                 y + 62);
  stayRow('Check-out',  fmtDate(checkOut),                                y + 78);
  doc.fillColor(ink500).font('Helvetica').fontSize(9).text('Nights', rcX + 14 + 180, y + 30);
  doc.fillColor(ink900).font('Helvetica-Bold').fontSize(9).text(String(stayNights || '—'), rcX + 14 + 230, y + 30);

  // ====== LINE ITEMS TABLE ======
  y = 290;
  const cols = [
    { key: '#',    x: margin + 8,        w: 22,  align: 'left'  },
    { key: 'Desc',  x: margin + 30,       w: 230, align: 'left'  },
    { key: 'SAC',   x: margin + 260,      w: 50,  align: 'left'  },
    { key: 'Qty',   x: margin + 312,      w: 40,  align: 'right' },
    { key: 'Rate',  x: margin + 354,      w: 80,  align: 'right' },
    { key: 'Amount',x: margin + 436,      w: contentW - 436 + margin - 8, align: 'right' },
  ];
  // header
  doc.rect(margin, y, contentW, 26).fillColor(ink900).fill();
  doc.fillColor('#fff').font('Helvetica-Bold').fontSize(8.5);
  doc.text('#',          cols[0].x, y + 9, { width: cols[0].w });
  doc.text('DESCRIPTION',cols[1].x, y + 9, { width: cols[1].w });
  doc.text('SAC',        cols[2].x, y + 9, { width: cols[2].w });
  doc.text('QTY',        cols[3].x, y + 9, { width: cols[3].w, align: 'right' });
  doc.text('RATE',       cols[4].x, y + 9, { width: cols[4].w, align: 'right' });
  doc.text('AMOUNT',     cols[5].x, y + 9, { width: cols[5].w, align: 'right' });

  // rows
  let rowY = y + 26;
  doc.font('Helvetica').fontSize(10);
  lines.forEach((l, i) => {
    if (i % 2 === 1) {
      doc.rect(margin, rowY, contentW, 24).fillColor(ink50).fill();
    }
    doc.fillColor(ink700).text(String(i + 1), cols[0].x, rowY + 8, { width: cols[0].w });
    doc.fillColor(ink900).text(l.description || '—', cols[1].x, rowY + 8, { width: cols[1].w, ellipsis: true });
    doc.fillColor(ink500).text('996311', cols[2].x, rowY + 8, { width: cols[2].w }); // SAC for hotel accommodation
    doc.fillColor(ink700).text(String(l.qty || 1), cols[3].x, rowY + 8, { width: cols[3].w, align: 'right' });
    doc.fillColor(ink700).text(inr(l.rate), cols[4].x, rowY + 8, { width: cols[4].w, align: 'right' });
    doc.fillColor(ink900).font('Helvetica-Bold').text(inr(l.amount), cols[5].x, rowY + 8, { width: cols[5].w, align: 'right' });
    doc.font('Helvetica');
    rowY += 24;
  });

  // table bottom border
  doc.moveTo(margin, rowY).lineTo(margin + contentW, rowY).strokeColor(ink300).lineWidth(1).stroke();

  // ====== TOTALS ======
  let tY = rowY + 18;
  const labelX = margin + 320;
  const valueX = margin + contentW - 8;
  const totalRow = (k, v, opts = {}) => {
    doc.fillColor(opts.bold ? ink900 : ink500)
       .font(opts.bold ? 'Helvetica-Bold' : 'Helvetica')
       .fontSize(opts.bold ? 11 : 10)
       .text(k, labelX, tY, { width: 120 });
    doc.fillColor(opts.color || (opts.bold ? ink900 : ink900))
       .font(opts.bold ? 'Helvetica-Bold' : 'Helvetica')
       .fontSize(opts.bold ? 11 : 10)
       .text(v, labelX + 120, tY, { width: valueX - labelX - 120, align: 'right' });
    tY += opts.bold ? 18 : 16;
  };

  totalRow('Subtotal', inr(subtotal));
  if (discount > 0) totalRow('Discount', `− ${inr(discount)}`);
  totalRow('Taxable Value', inr(taxable));
  totalRow(`CGST @ 9%`, inr(cgst));
  totalRow(`SGST @ 9%`, inr(sgst));

  // divider
  doc.moveTo(labelX, tY + 2).lineTo(valueX, tY + 2).strokeColor(ink300).stroke();
  tY += 10;

  totalRow('Grand Total', inr(grand), { bold: true, color: accent });
  totalRow('Amount Paid', inr(paid));
  if (balance > 0) totalRow('Balance Due', inr(balance), { bold: true, color: '#ef4444' });

  // ====== AMOUNT IN WORDS ======
  tY += 8;
  doc.roundedRect(margin, tY, contentW, 32, 6).fillColor(ink50).fill();
  doc.fillColor(ink500).font('Helvetica-Bold').fontSize(8).text('AMOUNT IN WORDS', margin + 12, tY + 7);
  doc.fillColor(ink900).font('Helvetica').fontSize(10)
     .text(numToWords(grand), margin + 12, tY + 18, { width: contentW - 24 });
  tY += 44;

  // ====== NOTES + PAYMENT INFO ======
  if (invoice.notes || invoice.paymentMethod) {
    if (invoice.notes) {
      doc.fillColor(ink500).font('Helvetica-Bold').fontSize(8).text('NOTES', margin, tY);
      doc.fillColor(ink700).font('Helvetica').fontSize(9).text(invoice.notes, margin, tY + 12, { width: contentW - 200 });
    }
    if (invoice.paymentMethod) {
      doc.fillColor(ink500).font('Helvetica-Bold').fontSize(8).text('PAYMENT', margin + contentW - 180, tY);
      doc.fillColor(ink700).font('Helvetica').fontSize(9)
        .text(`${invoice.paymentMethod}${invoice.paymentRef ? ` · ${invoice.paymentRef}` : ''}`, margin + contentW - 180, tY + 12, { width: 180 });
    }
    tY += 50;
  }

  // ====== TERMS ======
  doc.fillColor(ink500).font('Helvetica-Bold').fontSize(8).text('TERMS & CONDITIONS', margin, tY);
  doc.fillColor(ink700).font('Helvetica').fontSize(8);
  const terms = [
    '1. Payment is due upon receipt unless otherwise agreed in writing.',
    '2. All disputes are subject to Bengaluru jurisdiction only.',
    `3. GST registered under ${hotel.gstin}. PAN ${hotel.pan}.`,
    '4. This is a computer-generated invoice and does not require a signature.',
  ];
  let termY = tY + 12;
  terms.forEach((t) => { doc.text(t, margin, termY, { width: contentW }); termY += 11; });

  // ====== FOOTER ======
  const footY = doc.page.height - 60;
  doc.moveTo(margin, footY).lineTo(margin + contentW, footY).strokeColor(ink100).lineWidth(1).stroke();
  doc.fillColor(ink500).font('Helvetica').fontSize(8)
     .text(`${hotel.name} · ${hotel.web} · ${hotel.email}`, margin, footY + 8, { width: contentW, align: 'center' });
  doc.text(`Thank you for choosing ${hotel.name}. We look forward to welcoming you again.`,
     margin, footY + 22, { width: contentW, align: 'center' });

  doc.end();
  return doc;
}

module.exports = buildInvoicePdf;
