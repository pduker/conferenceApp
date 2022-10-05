function buildAuthorsMap(rawFormFields) {
  const authors = {}
  for (const [rawkey, value] of Object.entries(rawFormFields)) {
      const splitVals = rawkey.split("-")
      const id = splitVals[1]
      const field = splitVals[0]

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


module.exports = {
  buildAuthorsMap
}