const { exec } = require('child_process')
const fs = require('fs')
const path = require('path')
const { removeSpaces } = require('./utils')
const yaml = require('js-yaml')
const JSZip = require('jszip')
const { once } = require('events')

/**
 * Deletes the file at the specified path
 * @param {string} filePath
 */
async function deleteFile (filePath) {
  fs.unlinkSync(filePath)
}

/**
 * Converts a .docx document into raw html. Does not delete file after.
 * @param {string} inputFilePath
 * @param {string} outputFilePath
 * @returns {Promise<Buffer>} Returns a promise (that needs to be awaited) with the Buffer from the HTML file
 */
async function parseDocx (inputFilePath, outputFilePath) {

  if (!inputFilePath || !outputFilePath) {
    throw new Error('Valid paths were not passed!')
  }

  // Wrap this exec callback function in a promise so it's easier to work with
  await new Promise(function (resolve, reject) {
    exec(`pandoc ${inputFilePath} -f docx -t html -o ${outputFilePath}`, function (internalError, stdout, stderr){
      if (internalError) {
        console.error(internalError)
        reject(internalError)
      }
  
      if (stderr) {
        console.error(stderr)
        reject(stderr)
      }
      
      resolve(stdout)
    })
  })

  const fileBuffer = fs.readFileSync(outputFilePath)

  return fileBuffer
}

/**
 * Takes in a map of author information and a HTML abstract to write to a YAML file
 * @param {Object} authors A map where each author is mapped to it's information. First author is 0 and so on.
 * @param {string} authors.name The name of the author
 * @param {string} authors.institution The institution of the author
 * @param {string | ""} authors.bio The bio, optional param and could be empty
 * @param {string} abstract The HTML string from the parsed abstract upload
 */
function exportYAML(title, authors, abstract, suppMats) {
  const safeTitle = removeSpaces(title)
  let filePath = path.join(__dirname, '../tmp/yaml/papers', `${safeTitle}.yaml`)
  
  const uploadedPaper = {
    authors: Object.values(authors),
    title,
    abstract
  }
  if(suppMats){
    uploadedPaper.suppMats = suppMats
  }
  const doc = yaml.dump(uploadedPaper)
  fs.writeFileSync(filePath, doc.toString())
}

async function exportSessionYaml(sessions){
  const zip = new JSZip();
  for(const session of sessions){
    let title = session.title
    let slug = title.replace(/\s+/g, '-').toLowerCase()
    let filePath = path.join(__dirname, '../tmp/yaml/sessions', `${slug}.yaml`)
    let paperTitles = []
    for(const paper of session.Papers){
      paperTitles.push(paper.title)
    }
    const sessionYaml = {
      sessiontype:"",
      title,
      slug,
      room: session.room,
      time: `${session.start} - ${session.end}`,
      link: "",
      slack: "",
      zoom: "",
      chair:{name:session.chair  ,
            institution:"",
            format: ""},
      papers:paperTitles,
      respondent: {name: null}
    }
    const doc = yaml.dump(sessionYaml)
    fs.writeFileSync(filePath, doc)
    await zip.file(`${slug}.yaml`, doc);
  }

  await once(zip.generateNodeStream({type:'nodebuffer',streamFiles:true})
    .pipe(fs.createWriteStream(path.join(__dirname, '../tmp/yaml','sessions.zip'))), 'finish')
    
}

module.exports = {
  parseDocx,
  deleteFile,
  exportYAML,
  exportSessionYaml
}