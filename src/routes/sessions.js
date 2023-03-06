const express = require('express')
const { Sessions, Papers, Days } = require('../database/db')
const { getAllSessions } = require('../database/sessions')

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

module.exports = router