const { Days, Sessions, Papers, Authors } = require('./db')
const { updateChangedFields } = require('./utils')

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

async function createSession (time, description, DayId) {
  const session = await Sessions.create({
    time,
    description,
    DayId
  })

  return session
}

async function updateSession (newSession) {
  const currSession = await Sessions.findByPk(newSession.id)

  if (!currSession) {
    throw new Error('Could not find an existing session with that ID')
  }

  updateChangedFields(currSession, newSession)

  await currSession.save()
}

module.exports = {
  getAllSessions,
  getAllSessionsByDay,
  createSession,
  updateSession
}