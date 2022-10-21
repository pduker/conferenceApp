const { exec } = require('child_process')
const fs = require('fs')
const path = require('path')
const { parseToPathSafe } = require('./utils')

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
function exportYAML(title, authors, abstract) {
  // Export to YAML
  const safeTitle = parseToPathSafe(title)
  let filePath = path.join(__dirname, '../tmp/yaml', `${safeTitle}.yaml`)
  fs.writeFileSync(filePath, "---\n")
  let authorsString = "authors:\n"
  console.log(authors)
  for (const author of Object.values(authors)) {
    // author = {name: ..., institution: ..., bio: ...}
    authorsString += "\t- name: "+ author.name + "\n\t\tinstitution: " + author.institution + "\n\t\tbio: " + author.bio + "\n"
  }
  fs.appendFileSync(filePath, authorsString)
  fs.appendFileSync(filePath, "title: " + title)
  fs.appendFileSync(filePath, "\nabstract: |\n\t" + abstract)
}

module.exports = {
  parseDocx,
  deleteFile,
  exportYAML
}