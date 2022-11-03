const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const { getAuthRecordByUsername } = require('../database/security');

const SALT_ROUNDS = 10

// THIS ABSOLUTELY WILL MOVE TO AN ENVIRONMENT VARIABLE EVENTUALLY
// This is just here so everyone can get up and running quickly
const TOKEN_SECRET = 'R4sZPMZHEjMMzUlG4uqCIaJV8nR1TpPj'

async function compareToHash(password, hash) {
  return bcrypt.compare(password,hash);
}

async function createHash(input) {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return bcrypt.hash(input , salt);
}

function getToken(obj) {
  return jwt.sign(obj, TOKEN_SECRET, { expiresIn: '1h' });
}

async function verifyToken(token) {
  if (!token || token.length === 0)
    return null;
  try {
    const payload = jwt.verify(token, TOKEN_SECRET);

    const user = await getAuthRecordByUsername(payload.username)

    if (user) {
      return payload
    } else {
      console.log('Token for user is no longer valid!')
      return null
    }
  } catch(e){
    console.error(e);
    return null;
  }
}



module.exports = {
  compareToHash,
  createHash,
  getToken,
  verifyToken
}
