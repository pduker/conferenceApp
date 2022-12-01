const express = require('express')
const { compareToHash, getToken, createHash } = require('../auth/auth')
const { getAuthRecordByUsername } = require('../database/security')
const { createUser, getUserByUsername } = require('../database/users')

const router = express.Router()

router.post('/login', async function (req, res) {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      console.error('Bad request, missing username and password')
      res.status(400).send('Bad request')
    }

    const user = await getAuthRecordByUsername(username)

    if (!user) {
      console.log('User with that username does not exist')
      res.status(404).send('User with that password/username combination was not found')
      return
    }

    const hashedPassword = user.password

    if(await compareToHash(password, hashedPassword)) {
      const token = getToken({ id: user.id, username })
      res.json({ token })
    } else {
      console.log('User with that username does not exist')
      res.status(404).send('User with that password/username combination was not found')
    }
  } catch (err) {
    console.error(err)
    res.status(500).send('Failed to login user')
  }
})

router.post('/register', async function (req, res) {
  try {
    const { username, password, firstName, lastName } = req.body

    if (!username || !password  || !firstName || !lastName) {
      console.error('Bad request, missing required info')
      res.status(400).send({ status: 'error', message: 'Missing required info' })
    }

    const user = await getAuthRecordByUsername(username)

    if (user) {
      // User with that username already exists
      res.status(409).send('User with that username already exists')
    } else {
      const hash = await createHash(password)
      const user = await createUser(username, hash, firstName, lastName)

      res.json({ user: user.toJSON() })
    }
  } catch (err) {
    console.error(err)
    res.status(500).send('Failed to create user')
  }
})

module.exports = router