async function validateToken () {

  const token = sessionStorage.getItem('token')

  if (!token) {
    console.error('Not logged in')
    window.location.replace('/login')
    return
  }

  const tokenres = await fetch('api/valid', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })

  if (!tokenres.ok) {
    console.error('Not logged in')
    window.location.replace('/login')
  }

}

validateToken()