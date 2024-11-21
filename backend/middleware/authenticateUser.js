const jwt = require('jsonwebtoken')

const authenticateUser = (req, res, next) => {
    const token = req.session.token
    if (!token) {
        return res.status(401).send('You must be logged in to perform this action')
    }
    try {
        const user = jwt.verify(token, process.env.JWT_SECRET)
        req.user = user
        next()
    } catch (error) {
        console.error('Authentication error: ', error)
        res.status(403).send('Invalid session token')
    }
}

module.exports = authenticateUser