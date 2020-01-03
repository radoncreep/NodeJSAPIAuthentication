const router = require('express').Router()
const User = require('../model/User')
const bcrypt = require('bcryptjs')
const {registerValidation} = require('../validation')

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
        res.send(savedUser)
    } catch(err){
        res.status(400).send(err)
    }
})


module.exports = router