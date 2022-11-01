const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const SALT_ROUNDS = 10

async function compareToHash(password, hash) {
  return bcrypt.compare(password,hash);
}

async function createHash(input) {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return bcrypt.hash(input , salt);
}

function getToken(obj) {
  return jwt.sign(obj, Config.tokenSecret);
}

function verifyToken(token) {
  if (!token || token.length === 0)
    return null;
  try {
    //in production I would take the value of verify,
    //extract the user and make sure they are still
    //valid in the database by doing a db lookup
    return jwt.verify(token,Config.tokenSecret);
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
