import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    name: {type : String, required : true},
    email: {type : String, required : true, unique : true},
    password: {type : String, required : true},
    cartData : {type : Object, default : {}},
    created_at: {type : Date, default : Date.now},
},{minimize:false})

const userModel =mongoose.models.user|| new mongoose.model("User", userSchema)
export default userModel;