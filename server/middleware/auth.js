/*
in this file :   
    - we want to build a protected route <- for that purpos we use a piece of middleware to check the jwt .
    - we can name this file to protect.js but we named auth, because we use alot of middleware of authentication in this file .
    - this auth.js file going to check the json web token in the headers .
*/

//  let's code .
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const ErrorRes = require('../utils/Errors')

exports.protect = async (req, res, next)=>{
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        // set token variable to token, this .split(' ') mean split the result by the space becasue the token is going to be like this ( "Bearer asdf23")
        token = req.headers.authorization.split(' ')[1]
    }
    

    if(!token){
        return next(new ErrorRes('NOt authorized to access this route ', 401))
    }

    //  in this try.catch() block we want to decode the token thaw we got . 
    try {
        //  .verify()  is decode the token,and contain .verify( token <- that we get,your secrete token like -> process.env.JWT_SECRET) contain
        console.log(token)
        console.log('befor decoded ')
        const decoded = jwt.verify(token, process.env.SECRET_JWT)
        console.log(decoded)
        /*   
            -   now we want to search in the database for the user that request to us,
            -   when we got the user id ?? ( the user that requested to us ) :
                *   we got the user id in the token .
            

        */
       const user = await User.findById(decoded.id)

       if(!user){
           return next(new ErrorRes('no user found with this id', 404))
       }

       req.user = user;

       next()


    } catch (err) {
        console.log(err)
        return next(new ErrorRes('Not authorized to access this route', 401))
    }


}






