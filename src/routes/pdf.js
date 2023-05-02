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

        let sessions = schedule[day]['Sessions']
        sessions = sessions.sort((a,b) => sortSessionsByTime(a, b))
        
        for (let session in sessions) {          
          if (sessions[session]) {
            let previous = session > 0 ? sessions[session - 1] : -1;

            let period = getDayPeriod(sessions[session]['start'])
            if (previous != -1) {
              if (sessions[session]['start'] !== previous['start'] || sessions[session]['end'] !== previous['end']) {
                drawDayHeader(doc, schedule[day]['weekday'], period, sessions[session]['start'], sessions[session]['end'])
              }
            }
            else {
              drawDayHeader(doc, schedule[day]['weekday'], period, sessions[session]['start'], sessions[session]['end'])
            }

            doc.font('Proxima-Bold')
            .fontSize(11)
            .text(sessions[session]['title'].toUpperCase())
            doc.font('Proxima')
            .fontSize(11)
            .text(sessions[session]['chair'] + ', Chair', {paragraphGap:9})
            let papers = schedule[day]['Sessions'][session]['Papers']
            for (let paper in papers) {
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

                let intermediate = []
                for (let p in paragraphs) {
                  intermediate.push(...paragraphs[p].split(/[<>]/))
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
            if (previous != -1 && (sessions[session]['start'] !== previous['start'] || sessions[session]['end'] !== previous['end'])){
              doc
              .fontSize(1)
              .text(' '.repeat(129*14), {underline:true, paragraphGap:14})  
            }    
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

function sortSessionsByTime(a, b){
    if (convertTo24HourString(a.start) === convertTo24HourString(b.start))
      return convertTo24HourString(a.end) < convertTo24HourString(b.end) ? -1 : 1
    else
      return convertTo24HourString(a.start) < convertTo24HourString(b.start) ? -1 : 1
}

function convertTo24HourString (time) {
  const splitTime = time.split(" ") // get the 10:00 and PM of "10:00 PM"
  const hoursAndMinutes = splitTime[0].split(":") // get the 10 and 00 of 10:00
  const hours = parseInt(hoursAndMinutes[0]) // convert hours to a number (for offsets)
  const minutes = hoursAndMinutes[1] // get the minutes (still a string since we don't need to offset this)

  if (splitTime[1] === "PM" || splitTime[1] === "pm") {
      let final

      if (hours === 12) {
          final = `${hours}:${minutes}`
      } else {
          final = `${hours + 12}:${minutes}`
      }
      
      return final
  } else {
    if (hours.length < 2 || hours < 10)
      return `0${hours}:${minutes}` // Needs to be in full 24HR format still so we have a leading 0
    else 
      return `${hours}:${minutes}`
  }
}


function getDayPeriod(time) {
  if (convertTo24HourString(time) < '12:00') {
    return 'Morning'
  }
  else if (convertTo24HourString(time) < '16:00') {
    return 'Afternoon'
  }
  else {
    return 'Evening'
  }
}

function drawDayHeader(doc, weekday, period, start, end) {
  doc
  .fontSize(0)
  .text(' ', {paragraphGap:14})
  doc.font('Proxima-Bold')
  .fontSize(14)
  .text(weekday.toUpperCase() + ' ' + period.toUpperCase() + ' - ' + start + ' - ' + end)
  doc
  .fontSize(1)
  .text(' '.repeat(129*14), {underline:true, paragraphGap:14})
}

module.exports = router