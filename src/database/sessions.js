const { Days, Sessions, Papers, Authors } = require('./db')

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

async function createSession (time, DayId) {
  const session = await Sessions.create({
    time,
    DayId
  })

  return session
}


module.exports = {
  getAllSessions,
  getAllSessionsByDay,
  createSession
}