const express = require('express')
const { getAllDays, getSingularDay, createDay, updateDay, deleteDay } = require('../database/days')
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

router.get('/:id', async function(req, res){
  try{
    const { id } = req.params

    const day = await getSingularDay(id)

    res.json(day)
  } catch (err){
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

router.put('/', async function (req, res) {
  try {
    const newDay = req.body

    await updateDay(newDay)

    res.sendStatus(200)
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
})

router.delete('/', async function (req, res) {
  try {
    const { dayId } = req.query

    if (!dayId) {
      res.status(400).send('Missing required parameters!')
    }

    await deleteDay(dayId)

    res.sendStatus(200)
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
})


module.exports = router