const jwt = require('jsonwebtoken')
const JWT_SECRET = require('./config')

function authMiddleware(req,res,next) {
    const token = req.headers['authorization']
   const payload = jwt.verify(token,JWT_SECRET)

   try {
    if(payload) {
        req.id = payload.id
        next()
       }
   } catch(e) {
    return res.status(403).json({msg: "you are not logged in"})
   }
}

module.exports = authMiddleware