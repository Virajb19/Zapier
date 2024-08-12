const { Router } = require("express");
const authMiddleware = require("../src/middleware");
const {client} = require('../../db');
const { SignupSchema, SigninSchema } = require("../src/types/types");
const jwt = require('jsonwebtoken')
const JWT_SECRET = require('../src/config')


const userRouter = Router()

userRouter.post('/signup',async (req,res) => {
    const {username, email, password} = req.body
    const parsedData = SignupSchema.safeParse(req.body)

    if(!parsedData.success) {
       return res.json({msg: 'incorrect inputs'})
    }

    const userExists = await client.user.findFirst({
        where: {
            email: parsedData.email
        }
    })

    if(userExists) return res.json({msg: "you already have an account with those credemtials"})

    await client.user.create({
        data: {
            username,
            email,
            password
        }
    })
   // await sendEmail()
   
    return res.json("signed up successfully")
})

userRouter.post('/signin',async (req,res) => {
    const body = req.body
    const parsedData = SigninSchema.safeParse(body)

    if(!parsedData.success) return res.status(403).json({msg: "incorrect inputs"})

    const {username, password} = parsedData.data
    
    const user = await client.user.findFirst({
        where: {username, password}
    })

    if(!user) {
        return res.status(411).json({msg: "user does not exist"})
    }

    const token = jwt.sign({id: user.id}, JWT_SECRET)

    res.json({token})
})

userRouter.get('/user',authMiddleware,(req,res) => {
     const id = req.id
     res.send("Hello world")
})

userRouter.get('/:zapId',(req,res) => {
    
})


module.exports = userRouter