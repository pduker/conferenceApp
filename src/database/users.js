const { Users } = require('./db')
const { createAuthRecord } = require('./security')

async function getAllUsers() {
  const users = await Users.findAll()

  return users
}

async function getUserByID(id) {
  const user = await Users.findByPk(id)

  return user
}

async function getUserByUsername(username) {
  const user = await Users.findOne({ where: { username }})

  return user
}

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