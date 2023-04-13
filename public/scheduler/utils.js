function resetSessionModal (type) {
  $(`#${type}SessionTitleInput`).val('')
  $(`#${type}SessionDescriptionInput`).val('')
  $(`#${type}SessionChairInput`).val('')
  $(`#${type}SessionRoomInput`).val('')
  $(`#${type}SessionStartTime`).val('')
  $(`#${type}SessionEndTime`).val('')

  // Reset validation
  $(`#${type}SessionTitleInput`).removeClass('is-invalid')
  $(`#${type}SessionDescriptionInput`).removeClass('is-invalid')
  $(`#${type}SessionChairInput`).removeClass('is-invalid')
  $(`#${type}SessionRoomInput`).removeClass('is-invalid')
  $(`#${type}SessionStartTime`).removeClass('is-invalid')
  $(`#${type}SessionEndTime`).removeClass('is-invalid')
}

function resetDayModal (type) {
  $(`#${type}DayWeekday`).val('')
  $(`#${type}DayDateInput`).val('')

  // Reset validation
  $(`#${type}DayWeekday`).removeClass('is-invalid')
  $(`#${type}DayDateInput`).removeClass('is-invalid')
}