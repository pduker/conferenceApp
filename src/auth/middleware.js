const { verifyToken } = require('./auth')

function middleware(req, res, next){
  const token = req.headers.authorization
  const result = verifyToken(token)

  if (result){
    req.body.user = result
    return next()
  }

  res.send({ status:'error', data:'Unauthorized' })
}

module.exports = middleware