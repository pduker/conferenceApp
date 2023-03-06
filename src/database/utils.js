/**
 * Loops through and changes the value in currModel for any keys that are different in the updatedModel
 * @param {*} currModel The existing database model
 * @param {*} updatedModel The new updated model object (with updated fields)
 */
function updateChangedFields (currModel, updatedModel) {
  for (const [key, oldVal] of Object.entries(currModel)) {
    if (currModel[key] !== updatedModel[key]) {
      currModel[key] = updatedModel[key]
    }
  }
}

module.exports = {
  updateChangedFields
}