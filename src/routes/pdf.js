const express = require('express')
const PDFDocument = require('pdfkit')
const fs = require('fs');
const router = express.Router()

router.post('/', async function (req, res) {
  try {
    schedule = req.body
    let doc = new PDFDocument({bufferPages: true})
    doc.pipe(res);
    doc.image('../static/SMT_Logo.png', 430, 15, {align: 'center'})
    for (day in schedule) {
      doc.font('Times-Roman')
      .fontSize(14)
      .text(JSON.stringify(day));
      for (session in day) {
        doc.font('Times-Roman')
        .fontSize(11)
        .text(JSON.stringify(session));
        for (paper in session) {
          doc.font('Times-Roman')
          .fontSize(11)
          .text(JSON.stringify(paper));
        }
      }
    }
    

    res.type('application/pdf');
    res.attachment('test.pdf');
    doc.end();
  }
  catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});


module.exports = router