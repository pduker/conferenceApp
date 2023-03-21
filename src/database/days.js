const { Days, Sessions, Papers, Authors, SuppMaterials } = require('./db')
const { updateChangedFields } = require('./utils')

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

async function updateDay (newDay) {
  const currDay = await Days.findByPk(newDay.id)

  if (!currDay) {
    throw new Error('Could not find an existing day with that ID')
  }

  updateChangedFields(currDay, newDay)

  await currDay.save()
}

async function deleteDay (dayId) {
  const day = await Days.findByPk(dayId)

  if (!day) {
    throw new Error('Could not find a day that matched that ID')
  }

  await day.destroy()
}


module.exports = {
  getAllDays,
  createDay,
  updateDay,
  deleteDay
}