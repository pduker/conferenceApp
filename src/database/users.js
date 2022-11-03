const { User } = require('./db')
const { createAuthRecord } = require('./security')

async function getAllUsers() {
  const users = await User.findAll()

  return users
}

async function getUserByID(id) {
  const user = await User.findByPk(id)

  return user
}

async function getUserByUsername(username) {
  const user = await User.findOne({ where: { username }})

  return user
}

async function createUser(username, hashedPassword, firstName, lastName) {
  const user = await User.create({ username, firstName, lastName})
  await createAuthRecord(username, hashedPassword)

  return user
}

module.exports = {
  getAllUsers,
  getUserByID,
  getUserByUsername,
  createUser
}