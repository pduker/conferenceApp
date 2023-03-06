const { Days, Sessions, Papers } = require('./db')

async function getAllDays() {
  const days = await Days.findAll({ include: [ Sessions ]})

  return days
}

async function createDay(weekday, date) {
  const day = await Days.create({
    weekday,
    date
  })

  return day
}

module.exports = {
  getAllDays,
  createDay
}