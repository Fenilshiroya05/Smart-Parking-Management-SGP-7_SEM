const mongoose = require('mongoose')

//Connect to mongodb database
const connectDB = async()=>{
    try{
        const conn =await mongoose.connect('mongodb+srv://smartparking678:SmartP%40678@cluster0.ilfppyw.mongodb.net/smart_parking_db?retryWrites=true&w=majority',{
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log(`MongoDB connected ${conn.connection.host} `)
    }catch(err){
        console.log(`Error occured:${err.message}`)
        process.exit(1)
    } 
}

module.exports = connectDB