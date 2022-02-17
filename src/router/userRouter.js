const express = require('express')
const router = express.Router()
const user = require('../model/users')
const auth = require('../middleware/auth')
const sharp = require('sharp')
const multer = require('multer')
const {sendWelcomeMail,sendCancelMail} = require('../email/account')


const upload = multer({
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('Please Upload a Image Files.'))
        }
        cb(undefined,true)
    }
})

router.post('/user',async(req,res)=>{
    const newUser = new user(req.body)
    try{
        await newUser.save()
        sendWelcomeMail(newUser.email,newUser.name)
        const token = await newUser.generateAuthToken();
        res.status(200).send({newUser,token});
    }catch(e){
        res.status(400).send(e)
    }
    
})
router.post("/user/me/avatar",auth,upload.single('avatar'),async (req,res)=>{
    const buffer = await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.status(200).send()
},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})


router.delete("/user/me/avatar",auth,upload.single('avatar'),async (req,res)=>{
    req.user.avatar = undefined
    await req.user.save()
    res.status(200).send()
},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})


router.get('/user/me',auth,async(req,res)=>{
   res.send(req.user)   
})
router.get('/user',auth,async(req,res)=>{

    try{
        const users = await user.find({})
        console.log(users);
         res.status(200).send(users)
    }catch(e){
        res.status(500).send()
    }
})
router.get('/user/pic/:id',async (req,res)=>{
    try{       
        const userOne = await user.findById(req.params.id)
        console.log(userOne,"called");
        if(!userOne || !userOne.avatar){
            throw new Error("")
        }
        res.set('Content-Type','image/png')
        res.send(userOne.avatar)
    }catch(e){
        res.status(500).send(e)
    }
})
 
router.get('/user/:id',async(req,res)=>{
    try{
         const userOne = await user.find({_id:req.params.id});
         if(!userOne){
            return res.status(500).send()
        }
        res.status(201).send(userOne)
    }catch(e){
        res.status(404).send()
    }
})


router.post('/user/login', async (req, res) => {
    try {
        const userOne = await user.findByCredentials(req.body.email, req.body.password)
        const token = await userOne.generateAuthToken()
        res.status(201).send({userOne,token})
    } catch (e) {
        res.status(400).send()
        console.log("Error",e);
    }
})

router.post('/user/logout',auth,async (req,res)=>{
    try{
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !== req.token
        })
        await req.user.save()
        console.log(req.token);
        res.status(200).send('Logged Out!!')
    }catch(e){
        res.status(500).send()
    }
})

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


router.patch('/user/me',auth, async (req, res) => {
    const updates = Object.keys(req.body)    
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(500).send({ error: 'Invalid updates!' })
    }
    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        console.log(req.body,"called");
        res.status(200).send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/user/me',auth,async(req,res)=>{
    try{
        await req.user.remove() 
        sendCancelMail(req.user.email,req.user.name)
        res.status(200).send("Your Profile Is Deleted")
    }catch(e){
        res.status(500).send("Your Profile is no longer Exist.")
    }
})

module.exports = router;