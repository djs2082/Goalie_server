const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try{
        const token = req.headers.authorization.spit(' ')[1];
        const decodedToken = jwt.verify(token,process.env.JWT_SECRET_KEY)
        const userId = decodedToken.userId;
        if(req.body.userId && req.body.userId !== userId){
            throw  'Invalid User Id';
        }
        else{
            next();
        }
    }
    catch {
        res.status(401).json({
            error: new Error('Invalid request!')
        })
    }
}