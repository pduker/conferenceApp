const path = require("path")
const fs = require("fs")

function buildAuthorsMap(rawFormFields) {
  const authors = {}
  for (const [rawkey, value] of Object.entries(rawFormFields)) {
      const splitVals = rawkey.split("-")
      const id = splitVals[1]
      const field = splitVals[0]

      if (!(field === 'name' || field === 'institution' || field === 'bio')){
        continue;
      }
      
      let temp = authors[id]

      // If we have not added an entry yet for that author, add it
      if (!temp) {
          temp = {}
      }

      temp[field] = value

      // Update our authors listing based off the id
      authors[id] = temp
  }

  return authors
}

/**
 * Takes in a raw string with spaces and converts it to a path safe string (removing spaces)
 * @param {string} text 
 * @returns {string} The path safe name
 */
function removeSpaces(text) {
  return text.replace(/ /g,"_") // Replace all spaces with _ to make sure we support Unix file paths
}

/**
 * Checks that the directory structure is correct and creates folders if needed. Handles
 * other server startup tasks.
 * @param {string} parentDir The parent directory (usually __dirname)
 */
function initializeServer (parentDir) {
  if (!fs.existsSync(path.join(parentDir, "tmp"))) {
    fs.mkdirSync(path.join(parentDir, "tmp"))
  }

  if (!fs.existsSync(path.join(parentDir, "tmp", "yaml"))) {
    fs.mkdirSync(path.join(parentDir, "tmp", "yaml"))
  }

  if (!fs.existsSync(path.join(parentDir, "tmp", "yaml", "papers"))) {
    fs.mkdirSync(path.join(parentDir, "tmp", "yaml", "papers"))
  }

  if (!fs.existsSync(path.join(parentDir, "tmp", "yaml", "sessions"))) {
    fs.mkdirSync(path.join(parentDir, "tmp", "yaml", "sessions"))
  }
}

function parseSuppMats(files, body){
  if(files.length === 1){
    return null
  }else {
    let suppOnly = files.slice(1)
    let value = {}
    let i = 0
    for (const supp of suppOnly){
      value[supp.filename] = body[`material-type-${i}`]
      i++
    }
    console.log(value)
    return(value)
  }
}

function fileNameGenerator(req, file, callback) {
  let name = `${req.body.title}_${file.originalname}`
  name = name.replace(/ /g,"_") // Replace all spaces with _ to make sure we support Unix file paths
  callback(null, name)
}


module.exports = {
  buildAuthorsMap,
  removeSpaces,
  initializeServer,
  parseSuppMats,
  fileNameGenerator
}