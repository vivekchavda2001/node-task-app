const express = require('express')
const router = express.Router()
const user = require('../model/users')
const auth = require('../middleware/auth')
const sharp = require('sharp')
const multer = require('multer')
const {sendWelcomeMail,sendCancelMail} = require('../email/account')

//using multer for uploading files
const upload = multer({
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg)$/)){
            return cb(new Error(req.t('invalid_upload')))
        }
        cb(undefined,true)
    }
})
//creating new user
router.post('/user',async(req,res)=>{
    const newUser = new user(req.body)
    try{
        await newUser.save()
        sendWelcomeMail(newUser.email,newUser.name)
        const token = await newUser.generateAuthToken();
        res.status(201).send({newUser,token,message: req.t('user_create_success')});
    }catch(e){
        res.status(400).send(e)
    }
    
})
//creating new avatar, for user
router.post("/user/me/avatar",auth,upload.single('avatar'),async (req,res)=>{
    const buffer = await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.status(200).send()
},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})

//deleting avatar for user
router.delete("/user/me/avatar",auth,upload.single('avatar'),async (req,res)=>{
    req.user.avatar = undefined
    await req.user.save()
    res.status(200).send()
},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})

//getting details of logged in user
router.get('/user/me',auth,async(req,res)=>{
   res.send(req.user)   
})
//
router.get('/user',auth,async(req,res)=>{

    try{
        const users = await user.find({})
         res.status(200).send(users)
    }catch(e){
        res.status(500).send()
    }
})
//fetching profile pic of user
router.get('/user/pic/:id',async (req,res)=>{
    try{       
        const userOne = await user.findById(req.params.id)
        if(!userOne || !userOne.avatar){
            throw new Error("")
        }
        res.set('Content-Type','image/png')
        res.send(userOne.avatar)
    }catch(e){
        res.status(500).send(e)
    }
})
//login route for user
router.post('/user/login', async (req, res) => {
    try {
        const userOne = await user.findByCredentials(req.body.email, req.body.password)
        const token = await userOne.generateAuthToken()
        res.status(200).send({userOne,token})
    } catch (e) {
        res.status(400).send({msg:"Invalid Credentials"})
    }
})
//logout user
router.post('/user/logout',auth,async (req,res)=>{
    try{
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !== req.token
        })
        await req.user.save()
        console.log(req.token);
        res.status(200).send(req.t('logged_out'))
    }catch(e){
        res.status(500).send()
    }
})
//logout from all the devices 
router.post('/user/logoutall',auth,async (req,res)=>{
    try{
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token === ""
        })
        await req.user.save()
        console.log(req.token);
        res.status(200).send('Logged Out!!')
    }catch(e){
        res.status(500).send()
    }
})

//updating user details
router.patch('/user/me',auth, async (req, res) => {
    const updates = Object.keys(req.body)    
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(500).send({ error: req.t('invalid_updates') })
    }
    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.status(200).send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})

//deleting profile of user
router.delete('/user/me',auth,async(req,res)=>{
    try{
        await req.user.remove() 
        sendCancelMail(req.user.email,req.user.name)
        res.status(201).send({message:req.t('profile_deleted')})
    }catch(e){
        res.status(500).send({message:req.t('profile_not_exist')})
    }
})
module.exports = router;