const { verifyToken } = require('./auth')

async function authMiddleware(req, res, next){
  const raw = req.headers.authorization
  
  if (!raw) {
    res.status(403).send({ status:'error', data: 'Unauthorized' })
    return
  }

  //HTTP requires the token be in format "Bearer <token>" we only care about the token so parse it out here
  const token = raw.split(' ')[1]

  const result = await verifyToken(token)

  if (result){
    req.body.user = result
    return next()
  }

  res.status(403).send({ status:'error', data: 'Unauthorized' })
}

module.exports = authMiddleware