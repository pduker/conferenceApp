const express = require('express')
const { Sessions, Papers, Days } = require('../database/db')
const { getAllSessions, createSession } = require('../database/sessions')

const router = express.Router()

router.get('/', async function (req, res) {
  try {
    const day = await Days.create({
      weekday: 'Monday',
      date: '3-3-23'
    })

    const session = await Sessions.create({
      time: '7:00am - 8:50am',
      DayId: day.id
    })

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
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
})

module.exports = router