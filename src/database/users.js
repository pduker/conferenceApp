const { User } = require('./db')

async function getUserByID(id) {
  const user = await User.findByPk(id)

  return user
}

async function getUserByUsername(username) {
  const user = await User.findOne({ where: { username }})

  return user
}

module.exports = {
  getUserByID,
  getUserByUsername
}