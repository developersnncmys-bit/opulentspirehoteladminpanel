const Invoice = require('../models/Invoice');
const buildCrud = require('../utils/crudController');
const asyncHandler = require('../utils/asyncHandler');
const buildInvoicePdf = require('../utils/invoicePdf');

const crud = buildCrud(Invoice, {
  searchFields: ['code', 'guest', 'room'],
  sort: '-createdAt',
});

const downloadPdf = asyncHandler(async (req, res) => {
  const invoice = await Invoice.findById(req.params.id);
  if (!invoice) return res.status(404).json({ message: 'Invoice not found' });

  const filename = `${invoice.code || invoice._id}.pdf`;
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

  const doc = buildInvoicePdf(invoice.toObject());
  doc.pipe(res);
});

module.exports = { ...crud, downloadPdf };
