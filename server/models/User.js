const mongoose = require("mongoose");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')


const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: [true, "please provide a userName"],
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
    // match , regular expression for email .
    match: [
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "please provide a valid email.",
    ],
  },
  password: {
    type: String,
    required: [true, "please add a password"],
    minlength: 6,
    select: false, // select mean when ever we want to request a user, do we want to send a password as well, in future i learn en sha allah,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});


userSchema.methods.comparePassword = async function(password){
  return bcrypt.compare(password,this.password )
}


userSchema.methods.signedToken = function(){
  return jwt.sign({id: this._id}, process.env.SECRET_JWT, { expiresIn: process.env.JWT_EXPIRE  })  
}

userSchema.methods.resetPassToken = function(){
  //  we create a random string then hashing it then save it to the (resetPasswordToken) in the userSchema

  const resetToken = crypto.randomBytes(20).toString('hex')

  //  hashing restToken
  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')

  this.resetPasswordExpire = Date.now() +10 *(60*1000)

  return resetToken;


}


const User = mongoose.model("my Users", userSchema);

module.exports = User;
