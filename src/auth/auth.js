const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const { getAuthRecordByUsername } = require('../database/security');

const SALT_ROUNDS = 10

// THIS ABSOLUTELY WILL MOVE TO AN ENVIRONMENT VARIABLE EVENTUALLY
// This is just here so everyone can get up and running quickly
const TOKEN_SECRET = 'R4sZPMZHEjMMzUlG4uqCIaJV8nR1TpPj'

/**
 * Compares two hashes together, the password is in plaintext
 * @param {string} password Plaintext password
 * @param {string} hash Hashed password from the database
 * @returns
 */
async function compareToHash(password, hash) {
  return bcrypt.compare(password,hash);
}

/**
 * Creates a hash based off our hashing recipe
 * @param {string} input 
 * @returns 
 */
async function createHash(input) {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return bcrypt.hash(input , salt);
}

/**
 * Takes in the payload object with key values and returns a signed JWT that expires in 1h
 * @param {{}} payload
 * @returns 
 */
function getToken(payload) {
  return jwt.sign(payload, TOKEN_SECRET, { expiresIn: '1h' });
}

/**
 * Takes in a token and validates that it is not expired and not forged, returns the processed payload object if valid
 * @param {string} token 
 * @returns 
 */
async function verifyToken(token) {
  if (!token || token.length === 0)
    return null;
  try {
    const payload = jwt.verify(token.toString(), TOKEN_SECRET);

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
