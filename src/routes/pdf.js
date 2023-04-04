const express = require('express')
const PDFDocument = require('pdfkit')
const fs = require('fs')

const router = express.Router()

router.post('/', async function (req, res) {
  try {
    let doc = new PDFDocument({bufferPages: true})
    
    doc.pipe(res);
    doc.font('Times-Roman')
     .fontSize(12)
     .text(`this is test text`);

    res.type('application/pdf');
    res.attachment("test.pdf");
    doc.end();
  }
  catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});


module.exports = router