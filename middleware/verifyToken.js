const createError = require("../utils/createError");
const jwt = require("jsonwebtoken");

const verifyToken = (req,res,next) =>{
    const authHeader = req.headers.authorization;

    if(!authHeader) return next(createError(404, "token is not present"))

    const token = authHeader.split(" ")[1];
    jwt.verify(token,process.env.JWTKEY, (err,payload)=>{
        if(err) return next(createError(403, "token is not valid !"))
        req.user = payload
    })

    next();
}

module.exports = verifyToken;