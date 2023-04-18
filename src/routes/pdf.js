const express = require('express')
const PDFDocument = require('pdfkit')
const fs = require('fs');
const router = express.Router()

const p_tags = /<p>.*?<\/p>/gm
const bold_tags = /<strong>.*?<\/strong>/gmd
const italic_tags = /<em>.*?<\/em>/gmd

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
          
      for (let day in schedule) {
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
            .text(sessions[session]['title'].toUpperCase())
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
                let paragraphs = []
                let abstract = papers[paper]['abstract'].replace('\n',' ')
                
                let matches = abstract.match(p_tags)

                for (let m in matches) {
                  matches[m] = matches[m].replace(/(<p>)/,'')
                  matches[m] = matches[m].replace(/(<\/p>)/,'\n')
                  matches[m] = matches[m].replace(/\u0701/,' ')
                  paragraphs.push(matches[m])
                }

                let out = []
                let intermediate = []
                for (let p in paragraphs) {
                  intermediate.push(...paragraphs[p].split(/[<>]/))
                  
                  console.log('test')
                  console.log(intermediate)
                }

                for (let i = 0; i < intermediate.length; i++) {
                  if (intermediate[i].includes('span') || intermediate[i].length < 1) {

                  }
                  else if (intermediate[i] === 'em') {
                    i++
                    doc.font('Proxima-Italic')
                    .fontSize(11)
                    .text(intermediate[i], {paragraphGap: 9, continued: !intermediate[i].includes('\n')})
                    i++
                  }
                  else if (intermediate[i] === 'strong') {
                    i++
                    doc.font('Proxima-Bold')
                    .fontSize(11)
                    .text(intermediate[i], {paragraphGap: 9, continued: !intermediate[i].includes('\n')})
                    i++
                  }
                  else {
                    doc.font('Proxima')
                    .fontSize(11)
                    .text(intermediate[i], {paragraphGap: 9, continued: !intermediate[i].includes('\n')})
                  }
                }
                
                
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