const { Papers, SuppMaterials, Authors } = require('./db')
const { updateChangedFields } = require('./utils')

async function getAllPapers() {
  const papers = await Papers.findAll({ include: [SuppMaterials, Authors] })

  return papers
}

async function getPaperByTitle(title) {
  const paper = await Papers.findOne({ 
    where: {
      title
    },
    include: [Authors, SuppMaterials]
  })

  return paper
}

async function getAllPapersBySession(SessionId) {
  const papers = await Papers.findAll({
    where: {
      SessionId
    },
    include: [Authors, SuppMaterials]
  })

  return papers
}

async function createPaper(title, authors, abstract, suppMats) {
  let idString = title
  for(let author of Object.values(authors)){
    idString = idString + author.name
  }

  await Papers.destroy({
    where: {
      titleNameString: idString
    }
  })

  Authors.destroy({
    where: {
      PaperId: null
    }
  })

  SuppMaterials.destroy({
    where: {
      PaperId: null
    }
  })


  const paper = await Papers.create({
    title,
    abstract,
    titleNameString: idString
  })

  for (const author of Object.values(authors)) {
    await Authors.create({
      ...author,
      PaperId: paper.id
    })
  }

  if(suppMats){
    for (const [file, type] of Object.entries(suppMats)) {
      await SuppMaterials.create({
        id: file,
        PaperId: paper.id,
        type
      })
    }
  }

  return paper
}

async function updatePaper (newPaper) {
  const currPaper = await Papers.findByPk(newPaper.id)

  if (!currPaper) {
    throw new Error('A paper with that ID does not currently exist!')
  }

  updateChangedFields(currPaper, newPaper)

  if (newPaper.Authors) {
    let titleNameString = currPaper.title
    
    for (const newAuthor of newPaper.Authors) {
      const author = await Authors.findByPk(newAuthor.id)

      updateChangedFields(author, newAuthor)

      await author.save()

      titleNameString += author.name
    }

    currPaper.titleNameString = titleNameString
  }

  if (newPaper.SuppMaterials) {
    for (const newMaterial of newPaper.SuppMaterials) {
      const material = await SuppMaterials.findByPk(newMaterial.id)

      updateChangedFields(material, newMaterial)

      await material.save()
    }
  }

  // Write the updated values we changed in the JSON object into the actual database
  await currPaper.save() 
}

module.exports = {
  getAllPapers,
  createPaper,
  getPaperByTitle,
  getAllPapersBySession,
  updatePaper
}