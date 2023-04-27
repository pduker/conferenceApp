const { Days, Sessions, Papers, Authors, SuppMaterials } = require('./db')
const { deleteSession } = require('./sessions')
const { updateChangedFields } = require('./utils')

async function getAllDays() {
  const days = await Days.findAll({ 
    include: [{
      model: Sessions,
      include: [
        {
          model: Papers,
          include: [
            Authors, SuppMaterials
          ],
        }
      ]
    }],
    order: [
      // Order by the sessionOrder property on Papers, which is a child of Sessions in descending order
      [ Sessions, Papers, 'sessionOrder', 'DESC']
    ]
  })

  return days
}

async function getSingularDay(dayId){
  const day = await Days.findByPk(dayId, {include: [{ model: Sessions}]})

  if(!day){
    throw new Error('Could not find the Day that matched that ID')
  }

  return day;
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
  const day = await Days.findByPk(dayId, {include: [{ model: Sessions}]})

  if (!day) {
    throw new Error('Could not find a day that matched that ID')
  }

  if(day.Sessions){
   for(let session of day.Sessions){
    await deleteSession(session.id)
   }
  }

  await day.destroy()
}


module.exports = {
  getAllDays,
  getSingularDay,
  createDay,
  updateDay,
  deleteDay
}