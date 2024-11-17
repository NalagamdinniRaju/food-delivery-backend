import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
    userId: {type:String, requried:true},
    items : {type:Array, required:true},
    amount : {type:Number, required:true},
    address : {type:Object, required:true},
    status : {type:String, default:"Food Processing"},
    date : {type:Date, default:Date.now},
    payment : {type:Boolean, default:false}
})

const orderModel = mongoose.models.order || new mongoose.model('Order', orderSchema)

export default orderModel;