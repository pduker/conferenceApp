const express = require('express')
const textlive = require('texlive')

const router = express.Router()

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