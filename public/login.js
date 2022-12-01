/**
 * this function checks if the input is not just spaces, if it is undefined or null, and if it is the abstract is of size 0
 * @param {*} text this is the inputs from FormData feed in one at a time
 * @returns {boolean} returns true if not just spaces, not undefined or null , and is not of size 0 when it is a object
 */
function isNotWhiteSpace(text) {
  let hasEverything = /\S/.test(text) && isNotUndefinedOrNull(text)
  if (typeof text === "object") {
    if (text.size === 0) {
      hasEverything = false;
    }
  }
  return hasEverything;
}

/**
* this returns true if it is not undefined and null
* @param {*} text this is the input from FormData feed in one at a time
* @returns {boolean} This reutrns true if the argument is not undefined or null
*/
function isNotUndefinedOrNull(text) {
  return text !== undefined && text !== null
}

async function login(username, password) {
  try {

    const username = $('#username').val()
    const password = $('#password').val()

    console.log(username)
    console.log(password)

    if (!isNotWhiteSpace(username) || !isNotWhiteSpace(password)) {
      console.error('Please fill in all fields!')
      return
    }

    const submissionResponse = await fetch('api/auth/login', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        username,
        password
      })
    })

    if (submissionResponse.ok) {
      const { token } = await submissionResponse.json()

      // Put this in sessionStorage so it's reset on tab closing
      // Can be parsed to get user information out of it in the payload
      sessionStorage.setItem('token', token)

      console.log('Successfully logged in')
      window.location.assign('/scheduler')
      return true
    } else {
      console.error('Login failed')
      return false
    }
  } catch (err) {
    console.error(err)
    return false
  }
}

$('#submit').on('click', async function (e) {
  e.preventDefault();

  const success = await login(username, password)

  if (!success) {
    const alert = $("#warning-alert")
    alert.show()
  }
})