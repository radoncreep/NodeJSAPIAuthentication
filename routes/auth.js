const router = require('express').Router()
const User = require('../model/User')
const bcrypt = require('bcryptjs')
const {registerValidation, loginValidation} = require('../validation')

router.post('/register', async (req,res) => {

    // Validate new user data with Joi
    const {error} = registerValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    // Checks if user already exists
    const emailExists = await User.findOne({email: req.body.email})
    if(emailExists) return res.status(400).send('This Email is already Registered')

    // Hash Password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    // Creates new user
    const user = new User({
         name: req.body.name,
         email: req.body.email,
         password: hashedPassword 
    })
    try{ 
        const savedUser = await user.save()
        res.send({user: user._id})
    } catch(err){
        res.status(400).send(err)
    }
})

// Login
router.post('/login',async  (req, res) => {
    // Validate new user data with Joi
    const {error} = loginValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    // Checks if email exists
    const user = await User.findOne({email: req.body.email})
    if(!user) return res.status(400).send('Email or Password is incorrect')

    // Check Password
    const validPass = await bcrypt.compare(req.body.password,  user.password)
    if (!validPass) return res.status(400).send('Email or Password is incorrect')

    res.send('Logged In!')

})

  
module.exports = router