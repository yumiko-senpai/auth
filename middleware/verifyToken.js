import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
const   accessTokenoken = req.headers['authorization']?.split(' ')[1]
  if (!accessTokenoken) return res.status(401).json({ message: 'Access Denied' })

  try {
    const verfied = jwt.verify(accessTokenoken, process.env.JWT_SECRET)
    req.user = verfied
    next()
  } catch (err) {
    res.status(400).json({ message: 'Invalid Token' })
  }
}

export default verifyToken
