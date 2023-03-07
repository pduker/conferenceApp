const express = require('express')
const { Sessions, Papers, Days } = require('../database/db')
const { getAllSessions, createSession, updateSession, deleteSession } = require('../database/sessions')

const router = express.Router()

router.get('/', async function (req, res) {
  try {
    const sessions = await getAllSessions()

    res.json(sessions)
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
})

router.put('/', async function (req, res) {
  try {
    const newSession = req.body

    await updateSession(newSession)

    res.sendStatus(200)
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
})

router.post('/', async function (req, res) {
  try {
    const {time, DayId, description} = req.body

    if (!time || !DayId || !description) {
      res.status(400).send('Bad request, missing required fields')
      return
    }

    const session = await createSession(time, description, DayId)

    res.json(session)
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
})

router.delete('/', async function (req, res) {
  try {
    const { sessionId } = req.query

    if (!sessionId) {
      res.status(400).send('Missing required parameters!')
    }

    await deleteSession(sessionId)

    res.sendStatus(200)
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
})

module.exports = router