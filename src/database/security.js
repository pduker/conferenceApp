const { Security } = require('./db')

async function createAuthRecord (username, hashedPassword) {
  const authRecord = await Security.create({ username, hashedPassword, role: 'admin'})

  return authRecord
}

async function getAuthRecordByUsername (username) {
  const authRecord = await Security.findOne({ where: { username }})

  return authRecord
}

async function getAuthRecordByID (id) {
  const authRecord = await Security.findByPk(id)

  return authRecord
}

module.exports = {
  createAuthRecord,
  getAuthRecordByUsername,
  getAuthRecordByID
}