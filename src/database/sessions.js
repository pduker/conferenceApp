const { Days, Sessions, Papers } = require('./db')

async function getAllSessions () {
  const sessions = await Sessions.findAll({ include: [ Papers ]})

  return sessions
}

async function getAllSessionsByDay (weekday) {
  const day = await Days.findOne({ where: {
    weekday
  }, include: [ Sessions, Papers ]})

  return day
}


module.exports = {
  getAllSessions,
  getAllSessionsByDay
}