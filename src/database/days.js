const { Days, Sessions, Papers, Authors, SuppMaterials } = require('./db')

async function getAllDays() {
  const days = await Days.findAll({ include: [
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
  ]})

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