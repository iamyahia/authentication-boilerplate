const Errors = require('../utils/Errors')

// this error handler is 
const errorHandler = (err, req, res, next)=>{
    let error = {...err}
    error.message = err.message

console.log(err)

    // in mongoose 11000 mean duplicate error key
    if(err.code === 11000){
        const message = `Duplicate Field VAlue Enter`
        error = new Errors(message, 400)
    }

    // in mongoose we get a validationERror
    if(err.name === "ValidationError"){
        const message = Object.values(err.errors).map(val=>val.message)
        error = new Errors(message, 400)


    }

    res.status(error.status || 500).json({
        success: false,
        error: error.message || 'server error '
    })


}



module.exports = errorHandler ;