const express = require('express')
const { Sessions, Papers, Days } = require('../database/db')
const { getAllSessions, createSession, updateSession, deleteSession, duplicateSession } = require('../database/sessions')

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
    const {title, start, end, DayId, description} = req.body

    if (!title || !start || !end || !DayId || !description) {
      res.status(400).send('Bad request, missing required fields')
      return
    }

    const session = await createSession(title, start, end, description, DayId)

    res.json(session)
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
})

router.post('/:id', async function (req, res) {
  try {

    const { id } = req.params

    const newSession = await duplicateSession(id)

    res.json(newSession)
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
})

router.delete('/:id', async function (req, res) {
  try {
    const { id } = req.params

    await deleteSession(id)

    res.sendStatus(200)
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
})

module.exports = router