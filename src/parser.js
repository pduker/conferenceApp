const { exec } = require('child_process')
const fs = require('fs')
const path = require('path')

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


module.exports = {
  parseDocx,
  deleteFile
}