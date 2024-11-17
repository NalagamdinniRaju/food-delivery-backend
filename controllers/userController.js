import User from '../models/userModel.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import validator from 'validator'

// Create JWT Token
const createToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET)
}

// Login User
const loginUser = async (req, res) => {
    const { email, password } = req.body

    try {
        // Check if user exists
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Invalid credentials'
            })
        }

        // Create and send token
        const token = createToken(user._id)
        res.json({
            success: true,
            token
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Error logging in'
        })
    }
}

// Register User
const registerUser = async (req, res) => {
    const { name, email, password } = req.body

    try {
        // Check for existing user
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists'
            })
        }

        // Validate email format and strong password
        if (!validator.isEmail(email)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email format'
            })
        }

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 8 characters long'
            })
        }

        // Hash password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // Create new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword
        })

        const user = await newUser.save()
        const token = createToken(user._id)

        res.json({
            success: true,
            token
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Error creating user'
        })
    }
}

export { loginUser, registerUser }