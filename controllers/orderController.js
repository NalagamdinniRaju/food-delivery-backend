import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// Placing user order for fronted 
const placeOrder = async (req, res) => {
    // const fronted_url = "http://localhost:5173"
    const fronted_url = "https://nrs-food-delivery.netlify.app"
    try {
        const newOrder = new orderModel({
            userId: req.body.userId,
            items : req.body.items,
            amount : req.body.amount,
            address : req.body.address
        })

        await newOrder.save()
        await userModel.findByIdAndUpdate(req.body.userId, {cartData:{}});

        const line_items = req.body.items.map((item) => ({
            price_data: {
                currency: 'inr',
                product_data: {
                    name: item.name,
                },
                unit_amount: item.price * 100*80
            },
            quantity : item.quantity 

        }))
        line_items.push({
            price_data : {
                currency : 'inr',
                product_data : {
                    name : 'Delivery Fee',
                },
                unit_amount : 2*100*80
            },
            quantity : 1
        })

        const session = await stripe.checkout.sessions.create({
            line_items: line_items,
            mode: 'payment',
            success_url: `${fronted_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${fronted_url}/verify?success=false&orderId=${newOrder._id}`,
        });

        res.json({success : true, session_url: session.url  } )
    } catch (error) {
        console.log(error)
        res.json({success : false, message : "Failed to place order" })
    }
}

const verifyOrder = async(req,res) => {
    const{orderId, success} = req.body 
    try {
        if(success === "true"){
            await orderModel.findByIdAndUpdate(orderId, {payment: true})
            res.json({success : true, message : "Order placed successfully" })
        }else{
            await orderModel.findByIdAndDelete(orderId)
            res.json({success : false, message : "Order cancelled" })

        }
    } catch (error) {
        console.log(error)
        res.json({success : false, message : "Failed to verify order" })
    }
}

// User Orders for frontend 
const userOrders = async(req,res) => {
    try {
        const orders = await orderModel.find({userId: req.body.userId})
        res.json({success : true, data: orders })
    } catch (error) {
        console.log(error)
        res.json({success : false, message : "Failed to fetch orders" })
    }
}

//Listing orders for admin portal

const listOrders = async(req,res) => {
    try {
        const orders = await orderModel.find({})
        res.json({success : true, data: orders })
    } catch (error) {
        console.log(error)
        res.json({success : false, message : "Failed to fetch orders" })
    }
}


// Updating the status of an order
const updateOrderStatus = async(req,res) => {
    try {
        const {orderId, status} = req.body
        await orderModel.findByIdAndUpdate(orderId, {status: status})
        res.json({success : true, message : "Order status updated" })
    } catch (error) {
        console.log(error)
        res.json({success : false, message : "Failed to update order status" })
    }
}

export {placeOrder,verifyOrder,userOrders,listOrders,updateOrderStatus }