const jwt = require('jsonwebtoken');


const verifyToken = (req, res, next) => {
    const authHeader = req.headers.token

    if (authHeader) {

        const token = authHeader.split(" ")[1]

        jwt.verify(token, process.env.SECRET_JWT, (err, data) => {
            if (err) return res.status(401).json("Token is not valid!")

            req.isAdmin = data
            next();
        })
    } else {
        return res.status(401).json("You are not authenticated!")
    }
}

const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.isAdmin.isAdmin) {
            next()
        } else {
            res.status(403).json("You are not allowed to do that")
        }
    })
}


module.exports = {
    verifyTokenAndAdmin
}