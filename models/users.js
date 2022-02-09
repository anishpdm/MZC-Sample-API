const mongoose=require('mongoose')

let MongooseSchema= mongoose.Schema

const userSchema=new MongooseSchema(
    {
        name:String,
        mobile:String,
        email:String,
        password:String

    }
)
var userModel=mongoose.model("users",userSchema)
module.exports={userModel}