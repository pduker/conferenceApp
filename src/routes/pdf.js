const express = require('express')
const PDFDocument = require('pdfkit')
const fs = require('fs');
const router = express.Router()

router.post('/', async function (req, res) {
  try {
    schedule = req.body
    let doc = new PDFDocument({bufferPages: true})
    doc.pipe(res);
    // doc.image('../static/SMT_Logo.png', 430, 15, {align: 'center'})
    for (day in schedule) {
      if (parseInt(day) != 0) {
        doc.text(' ', {paragraphGap:9})
      }
      doc.font('Helvetica-Bold')
      .fontSize(14)
      .text(schedule[day]['weekday'].toUpperCase(), {paragraphGap:12})
      // add spacing and line between day and sessions
      let sessions = schedule[day]['Sessions']
      for (let session in sessions) {
        // add spacing and line between sessions
        if (session) {
          doc.font('Helvetica-Bold')
          .fontSize(11)
          .text(sessions[session]['title'].toUpperCase())
          doc.font('Helvetica')
          .fontSize(11)
          .text(sessions[session]['chair'] + ', Chair', {paragraphGap:9})
          let papers = schedule[day]['Sessions'][session]['Papers']
          for (let paper in papers) {
            // add spacing between papers
            doc.font('Helvetica-Bold')
            .fontSize(11)
            .text(papers[paper]['title'])
            let authors = ""
            let author_list = schedule[day]['Sessions'][session]['Papers'][paper]['Authors']
            for (let author in author_list) {
              if (parseInt(author) != 0) {
                authors += ", "
              }
              authors += author_list[author]['name']
              + ` (${author_list[author]['institution']})`
            }
            doc.font('Helvetica')
            .fontSize(11)
            .text(authors, {paragraphGap:9})
          }
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