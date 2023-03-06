const express = require('express')
const { Sessions, Papers, Days } = require('../database/db')
const { getAllSessions, createSession } = require('../database/sessions')

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

router.post('/', async function (req, res) {
  try {
    const {time, DayId} = req.body

    if (!time || !DayId) {
      res.status(400).send('Bad request, missing required fields')
      return
    }

    const session = await createSession(time, DayId)

    res.json(session)
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
})

module.exports = router