const jwt = require('jsonwebtoken')
const user = require('../models/user')

const isLogin = async (req,res,next)=>{
    let token
    if (req.cookies.token) {
        try{
            token = jwt.verify(req.cookies.token,process.env.JWT_SECRET)
            res.user = await user.findById(token.id)
            res.token = 1;
            if (res.user.name === 'admin') {
                res.token = 2;
            }
            next()
        }
        catch(error){
            console.log(error);
            res.redirect('/');
        }
    }else{
        res.token = 0;
        res.user = 0;
        next();
    }
}

module.exports = {isLogin}