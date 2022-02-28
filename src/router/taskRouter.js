const express = require('express')
const router = express.Router()
const Task = require('../model/tasks')
const auth = require('../middleware/auth')

router.post('/task',auth,async(req,res)=>{
    const newTask = new Task({
        ...req.body,
        owner:req.user._id
    })
    try{
        await newTask.save()
        res.status(200).send(newTask);
    }catch(e){
        res.status(400).send(e)
    }
})
router.get('/task',auth,async (req,res)=>{
    const match = {}
    const sort = {}
    if(req.query.completed){
        match.completed = req.query.completed === true
    }
    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]]=parts[1]==='desc'?-1:1 
    }
    try{
       
        await req.user.populate({
            path:'tasks',
            match,
            options:{
                limit:parseInt(req.query.limit),
                skip:parseInt(req.query.skip)
            },
            sort
        }).execPopulate()
        res.status(200).send(req.user.tasks)

    }catch(e){
        res.status(500).send(e)
    }
   
})
router.get('/task/:id',auth,async (req,res)=>{
    try{
        const task = await Task.find({_id:req.params.id,owner:req.user._id})
            if(!task){
                return res.status(404).send()
            }
            res.status(200).send(task)
    }catch(e){
        res.status(404).send()
    }
})
router.patch('/task/:id',auth,async(req,res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error:req.t('invalid_updates') })
    }
    try{        
        const taskOne = await Task.findOne({_id:req.params.id,owner:req.user.id})
        if(!taskOne){
            return res.status(404).send()
        }
        updates.forEach((update) => taskOne[update] = req.body[update])
        await taskOne.save()
        res.status(200).send(taskOne)
    }catch(e){
        res.status(500).send()
    }
})
router.delete('/task/:id',auth,async(req,res)=>{
    try{
        const taskOne = await Task.findOneAndDelete({_id:req.params.id,owner:req.user.id})
        if(!taskOne){
            return res.status(404).send()
        }
        res.status(200).send(taskOne)
    }catch(e){
        res.status(500).send()
    }
})

module.exports = router