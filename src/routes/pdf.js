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
    doc.registerFont('Proxima', 'src/static/proxima_nova_font.otf')
    doc.registerFont('Proxima-Italic', 'src/static/proxima_italic.otf')
    doc.registerFont('Proxima-Bold', 'src/static/proxima_bold.otf')
    for (let i = 0; i<2; i++) {
          
      for (day in schedule) {
        // if (parseInt(day) != 0) {
        //   doc
        //   .fontSize(1)
        //   .text(' '.repeat(129*14), {paragraphGap:9, underline:true})
        // }
        doc.font('Proxima-Bold')
        .fontSize(14)
        .text(schedule[day]['weekday'].toUpperCase())
        doc
        .fontSize(1)
        .text(' '.repeat(129*14), {underline:true, paragraphGap:14})
        // add spacing and line between day and sessions
        let sessions = schedule[day]['Sessions']
        for (let session in sessions) {
          // add spacing and line between sessions
          if (session) {
            doc.font('Proxima-Bold')
            .fontSize(11)
            .text(sessions[session]['title'].toUpperCase(), {continued:true}).font('Times-Roman').text('this is a test')
            doc.font('Proxima')
            .fontSize(11)
            .text(sessions[session]['chair'] + ', Chair', {paragraphGap:9})
            let papers = schedule[day]['Sessions'][session]['Papers']
            for (let paper in papers) {
              // add spacing between papers
              doc.font('Proxima-Bold')
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
              doc.font('Proxima')
              .fontSize(11)
              .text(authors, {paragraphGap:9})
              if (i == 1) {
                doc.font('Proxima')
                .text(papers[paper]['abstract'],{align: 'justify'})
              }
            }            
            doc
            .fontSize(1)
            .text(' '.repeat(129*14), {underline:true, paragraphGap:14})
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