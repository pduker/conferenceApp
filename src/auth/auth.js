const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

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
  return jwt.sign(obj, TOKEN_SECRET);
}

function verifyToken(token) {
  if (!token || token.length === 0)
    return null;
  try {
    //in production I would take the value of verify,
    //extract the user and make sure they are still
    //valid in the database by doing a db lookup
    return jwt.verify(token, TOKEN_SECRET);
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
