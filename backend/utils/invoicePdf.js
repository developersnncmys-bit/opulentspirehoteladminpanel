const PDFDocument = require('pdfkit');

function inr(n) {
  const v = Number(n) || 0;
  return `Rs. ${v.toLocaleString('en-IN')}`;
}

function formatDate(d) {
  if (!d) return '—';
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return String(d);
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function buildInvoicePdf(invoice, opts = {}) {
  const doc = new PDFDocument({ size: 'A4', margin: 50 });

  const hotelName = opts.hotelName || 'Opulent Spire Hotel';
  const hotelAddr = opts.hotelAddr || 'Operations Suite · v2.0';
  const accent    = '#244cf5';
  const ink900    = '#11152a';
  const ink500    = '#566388';
  const ink200    = '#d6dbe9';

  // Header
  doc.fillColor(ink900).font('Helvetica-Bold').fontSize(22).text(hotelName, 50, 50);
  doc.fillColor(ink500).font('Helvetica').fontSize(10).text(hotelAddr);
  doc.moveDown(0.3);

  doc.fillColor(accent).font('Helvetica-Bold').fontSize(28)
     .text('INVOICE', 400, 50, { align: 'right' });
  doc.fillColor(ink500).font('Helvetica').fontSize(10)
     .text(`# ${invoice.code || invoice._id}`, { align: 'right' });
  doc.text(`Date: ${formatDate(invoice.createdAt || Date.now())}`, { align: 'right' });

  // Divider
  doc.moveTo(50, 130).lineTo(545, 130).strokeColor(ink200).lineWidth(1).stroke();

  // Bill to
  doc.fillColor(ink500).font('Helvetica').fontSize(9).text('BILL TO', 50, 150);
  doc.fillColor(ink900).font('Helvetica-Bold').fontSize(14).text(invoice.guest || '—', 50, 165);
  if (invoice.room) {
    doc.fillColor(ink500).font('Helvetica').fontSize(10).text(`Room: ${invoice.room}`, 50, 185);
  }

  // Status badge
  const statusY = 150;
  const statusW = 90;
  const statusX = 545 - statusW;
  const status = invoice.status || 'Paid';
  const statusColor = status === 'Paid' ? '#10b981' : status === 'Partial' ? '#f59e0b' : '#ef4444';
  doc.roundedRect(statusX, statusY, statusW, 22, 6).fillColor(statusColor).fill();
  doc.fillColor('#fff').font('Helvetica-Bold').fontSize(10)
     .text(status.toUpperCase(), statusX, statusY + 6, { width: statusW, align: 'center' });

  // Items table header
  const tableTop = 230;
  doc.rect(50, tableTop, 495, 24).fillColor('#f6f7fb').fill();
  doc.fillColor(ink500).font('Helvetica-Bold').fontSize(9);
  doc.text('DESCRIPTION', 60, tableTop + 8);
  doc.text('AMOUNT', 460, tableTop + 8, { width: 75, align: 'right' });

  // Items row
  let y = tableTop + 34;
  doc.fillColor(ink900).font('Helvetica').fontSize(11);
  doc.text(`Stay charges${invoice.room ? ` - Room ${invoice.room}` : ''}`, 60, y);
  doc.text(inr(invoice.total), 460, y, { width: 75, align: 'right' });

  // Divider
  y += 30;
  doc.moveTo(50, y).lineTo(545, y).strokeColor(ink200).lineWidth(1).stroke();

  // Totals
  y += 14;
  const labelX = 360;
  const valueX = 460;

  doc.fillColor(ink500).font('Helvetica').fontSize(11).text('Subtotal', labelX, y);
  doc.fillColor(ink900).text(inr(invoice.total), valueX, y, { width: 75, align: 'right' });

  y += 20;
  doc.fillColor(ink500).text('GST', labelX, y);
  doc.fillColor(ink900).text(inr(invoice.gst), valueX, y, { width: 75, align: 'right' });

  y += 22;
  doc.moveTo(labelX, y).lineTo(545, y).strokeColor(ink200).stroke();

  y += 12;
  doc.fillColor(ink900).font('Helvetica-Bold').fontSize(13).text('Grand Total', labelX, y);
  doc.fillColor(accent).fontSize(14)
     .text(inr(Number(invoice.total || 0) + Number(invoice.gst || 0)), valueX, y, { width: 75, align: 'right' });

  // Footer
  doc.fillColor(ink500).font('Helvetica').fontSize(9)
     .text('Thank you for your stay. This is a computer-generated invoice.', 50, 760, {
       align: 'center', width: 495,
     });

  doc.end();
  return doc;
}

module.exports = buildInvoicePdf;
