const { Security } = require('./db')

/**
 * Creates a AuthRecord in our Security database table.
 * Mostly is used by createUser and should not be used directly outside the auth system
 * @param {string} username 
 * @param {string} hashedPassword 
 * @returns 
 */
async function createAuthRecord (username, hashedPassword) {
  const authRecord = await Security.create({ username, password: hashedPassword, role: 'admin'})

  return authRecord
}

/**
 * Finds an AuthRecord by username, returns nothing otherwise
 * @param {string} username 
 * @returns 
 */
async function getAuthRecordByUsername (username) {
  const authRecord = await Security.findOne({ where: { username }})

  return authRecord
}

/**
 * Finds an AuthRecord by ID, returns nothing otherwise
 * @param {string} id 
 * @returns 
 */
async function getAuthRecordByID (id) {
  const authRecord = await Security.findByPk(id)

  return authRecord
}

module.exports = {
  createAuthRecord,
  getAuthRecordByUsername,
  getAuthRecordByID
}