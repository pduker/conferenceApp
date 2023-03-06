const { Papers, SuppMaterials, Authors } = require('./db')

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

  const paper = await Papers.create({
    title,
    abstract
  })

  for (const author of Object.values(authors)) {
    await Authors.create({
      ...author,
      PaperId: paper.id
    })
  }

  for (const [file, type] of Object.entries(suppMats)) {
    await SuppMaterials.create({
      id: file,
      PaperId: paper.id,
      type
    })
  }

  return paper
}

module.exports = {
  getAllPapers,
  createPaper,
  getPaperByTitle,
  getAllPapersBySession
}