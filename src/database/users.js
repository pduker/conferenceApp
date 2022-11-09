const { Users } = require('./db')
const { createAuthRecord } = require('./security')

/**
 * Finds and returns all Users in our database
 * @returns 
 */
async function getAllUsers() {
  const users = await Users.findAll()

  return users
}

/**
 * Gets a User object by it's ID
 * @param {string} id 
 * @returns 
 */
async function getUserByID(id) {
  const user = await Users.findByPk(id)

  return user
}

/**
 * Gets a User object by it's username
 * @param {*} username 
 * @returns 
 */
async function getUserByUsername(username) {
  const user = await Users.findOne({ where: { username }})

  return user
}

/**
 * Creates a new user and corresponding AuthRecord
 * @param {string} username 
 * @param {string} hashedPassword 
 * @param {string} firstName 
 * @param {string} lastName 
 * @returns User model created
 */
async function createUser(username, hashedPassword, firstName, lastName) {
  const user = await Users.create({ username, firstName, lastName})
  await createAuthRecord(username, hashedPassword)

  return user
}

module.exports = {
  getAllUsers,
  getUserByID,
  getUserByUsername,
  createUser
}