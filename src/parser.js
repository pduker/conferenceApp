const { exec } = require('child_process')
const fs = require('fs')
const path = require('path')

/**
 * Returns a buffer of the file (if it exists)
 * @param {string} fileName 
 * @returns 
 */
async function readFinishedFile (fileName) {
  const file = fs.readFileSync(path.join(__dirname, '../tmp', fileName))
  return file
}

async function cleanUpFile (fileName) {

}

/**
 * Takes a file name from the uploader and reads the tmp file to parse from DOCX format to HTML
 * @param {string} localFileName 
 * @returns {Promise<Buffer>} Returns a promise (that needs to be awaited) with the Buffer from the HTML file
 */
async function parseDocx (localFileName) {

  if (!localFileName) {
    throw new Error('A valid file name was not passed!')
  }

  const fileName = localFileName.split('.')[0] 

  // Wrap this exec callback function in a promise so it's easier to work with
  await new Promise(function (resolve, reject) {

    const inputFilePath = path.join(__dirname, '../tmp', localFileName)
    const outputFilePath = path.join(__dirname, '../tmp', `${fileName}.html`)

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

  const fileBuffer = await readFinishedFile(`${fileName}.html`)
  
  return fileBuffer
}


module.exports = {
  parseDocx,
  cleanUpFile
}