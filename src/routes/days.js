const express = require('express')
const { getAllDays, createDay } = require('../database/days')
const { Sessions, Papers, Days } = require('../database/db')
const { getAllSessions } = require('../database/sessions')

const router = express.Router()

router.get('/', async function (req, res) {
  try {
    const days = await getAllDays()

    res.json(days)
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
})

router.post('/', async function (req, res) {
  try {
    const { weekday, date } = req.body

    if (!weekday || !date) {
      res.status(400).send('Bad request, missing required fields')
      return
    }

    const day = await createDay(weekday, date)

    res.json(day)
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
})

module.exports = router