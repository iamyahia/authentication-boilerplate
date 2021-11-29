const mongoose = require('mongoose')

const connectDB = ()=>{
    mongoose.connect(process.env.MONGO_URI)

mongoose.connection.once('open',()=>{
    console.log('DB Connected')
})
.on('error', err=>{
    console.log(`DB connect err: ${err}`)
})
}


module.exports = connectDB();