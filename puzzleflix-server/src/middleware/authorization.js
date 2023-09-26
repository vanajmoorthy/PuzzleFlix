const jwt = require("jsonwebtoken");
require('dotenv').config();

const authenticateToken = (req, res, next) => { 
    const authHeader = req.headers['authorization']; //Bearer TOKEN
    const token = authHeader && authHeader.split(" ")[1]; //Bearer index 0, TOKEN index 1

    if (token == null){
        return res.status(401).json({error:"NULL TOKEN"})
    } else {//verify token was created using our secret 
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
            if (error){
                return res.status(403).json({error:error.message});
            }
            req.user = user;
            next();
        })
    }
}
module.exports = {authenticateToken};