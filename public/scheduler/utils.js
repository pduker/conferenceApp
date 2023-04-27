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

function handleUpdatingSortableList () {

  if (currentlySelectedSessionPapersSortable !== null) {
    currentlySelectedSessionPapersSortable.destroy() // Cleanup the old instance
  }

  // Create the sortable list from the rendered papers in editSessionModal
  currentlySelectedSessionPapersSortable = Sortable.create(document.getElementById('insertPapers'), {
    group: 'papers',
    sort: true,
    easing: 'cubic-bezier(1, 0, 0, 1)',
    dataIdAttr: 'data-paperId' // This is the paper id on each card. Will be outputted later for order adjustment
  })
}