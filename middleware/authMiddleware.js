const jwt = require('jsonwebtoken')
const user = require('../models/user')

const protect = async (req,res,next)=>{
    let token
    if (req.cookies.token) {
        try{
            token = jwt.verify(req.cookies.token,process.env.JWT_SECRET)
            res.user = await user.findById(token.id)
            next()
        }
        catch(error){
            console.log(error);
            res.redirect('/');
        }
    }else{
        res.redirect('/')
    }
}

module.exports = {protect}