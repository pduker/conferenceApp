const { Days, Sessions, Papers, Authors, SuppMaterials } = require('./db')
const { updateChangedFields } = require('./utils')

async function getAllSessions () {
  const sessions = await Sessions.findAll({ include: [ 
    { model: Papers, include: [ Authors, SuppMaterials ] }
]})

  return sessions
}

async function getAllSessionsByDay (weekday) {
  const day = await Days.findOne({ where: {
    weekday
  },
  include: [
    { model: Sessions,
      include: [
        {
          model: Papers,
          include: [
            Authors, SuppMaterials
          ]
        }
      ]
    } 
  ] 
})

  return day
}

async function createSession (title, start, end, description, chair, room, DayId) {
  const session = await Sessions.create({
    title, 
    start,
    end,
    description,
    room,
    chair,
    DayId
  })

  session.Papers = []

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

async function duplicateSession (sessionId) {
  const session = await Sessions.findByPk(sessionId)

  if (!session) {
    throw new Error('Could not find a session that matched that ID')
  }

  const { DayId, description, title, start, end } = session

  const newSession = await createSession(title, start, end, description, DayId)

  return newSession
}

async function deleteSession (sessionId) {
  const session = await Sessions.findByPk(sessionId)

  if (!session) {
    throw new Error('Could not find a session that matched that ID')
  }

  await session.destroy()
}

module.exports = {
  getAllSessions,
  getAllSessionsByDay,
  createSession,
  updateSession,
  duplicateSession,
  deleteSession
}