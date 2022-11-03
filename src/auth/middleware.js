const { verifyToken } = require('./auth')

async function authMiddleware(req, res, next){
  const raw = req.headers.authorization
  const token = raw.split(' ')[1]
  const result = await verifyToken(token)

  if (result){
    req.body.user = result
    return next()
  }

  res.status(403).send({ status:'error', data: 'Unauthorized' })
}

module.exports = authMiddleware