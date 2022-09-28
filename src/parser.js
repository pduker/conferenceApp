const { exec } = require('child_process')

async function parseDocx (localFileName) {

  if (!localFileName) {
    throw new Error('A valid file name was not passed!')
  }

  // Wrap this exec callback function in a promise so it's easier to work with
  const output = await new Promise(function (resolve, reject) {
    exec(`pandoc ${localFileName} -f `, function (internalError, stdout, stderr){
      if (internalError) {
        console.error(internalError)
        reject(internalError)
      }
  
      if (stderr) {
        console.error(stderr)
        reject(stderr)
      }
      
      if (stdout) {
        resolve(stdout)
      } else {
        console.error('No response was sent from pandoc!')
        reject()
      }
    })
  })

  if (!output) {
    throw new Error('Pandoc did not execute properly!')
  }
}


module.exports = {
  parseDocx
}