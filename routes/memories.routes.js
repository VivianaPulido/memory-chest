const express= require('express')
const router= express.Router()

const mongoose= require('mongoose')

const uploadCloud = require('../configs/cloudinary')

const Memory= require('../models/Memory.model')
const User= require('../models/User.model')


//get create memory
router.get('/create-memory', (req, res, next) => {
  res.render('create')
})

//post create memory
router.post('/create-memory',  uploadCloud.single('image'), async(req, res, next) => {
   const {title, description}= req.body
  const imgPath= req.file.path
  const imgName= req.file.originalname
  const userId= req.session.currentUser._id
   console.log('AQUI', req.body, req.file)
   //console.log('este es el userId', userId)

  const newMemory= await Memory.create({title, imgPath, imgName, description})
  //console.log('esta es la newMemory', newMemory)
  const user= await User.findByIdAndUpdate(userId, { $push: { memories: newMemory._id}})
  //console.log('user con memories pusheadas', user)

  res.redirect('/profile')
})

<<<<<<< HEAD
// //delete memories asi estaba antes
// router.post('/delete/:id', async(req, res, nest)=> {
//   const {id} = req.params
//   console.log("Este es el id que encuentra", id)
//   const foundMemory= await Memory.findByIdAndDelete(id)
//   res.redirect('/profile')
// })

//delete memories
router.post('/delete/:id', async(req, res, nest)=> {
  const id = req.params.id
  //console.log("Este es el id que encuentra", id)
=======
//delete memories
router.post('/delete/:id', async(req, res, nest)=> {
  const {id} = req.params
>>>>>>> 44cc949576f73bbead29b1fdd85684df75cfd79c
  const foundMemory= await Memory.findByIdAndDelete(id)
  res.redirect('/profile')
})


//get edit memory
router.get('/edit/:id', async(req, res, next) => {
  const id= req.params.id
  const foundMemory= await Memory.findById(id)
  //console.log('PORAQUIII:', foundMemory) >>si obtengo el objeto completo de memory
  res.render('edit', foundMemory)
})

//post edit memory >> funciona pero tengo que pasar todos los campos
router.post('/edit/:id', uploadCloud.single('image'), async(req, res, next) => {
  const {title, description}= req.body
  
  const id= req.params.id

  if(!req.file){
    const memoryChanges= await Memory.findByIdAndUpdate(id, {$set:{title, description}}) 
  }else{
    const imgPath= req.file.path
    const imgName= req.file.originalname
    const memoryChanges= await Memory.findByIdAndUpdate(id, {$set:{title, imgName, imgPath, description}})
    //console.log('Estos son los cambios:', memoryChanges)
  }
  res.redirect('/profile')
})


<<<<<<< HEAD
=======
//get profile 
router.get('/profile', async(req, res, next) => {
  const userInSession= req.session.currentUser
  console.log(req.sesseion)
  const userId= req.session.currentUser._id
  const foundUser= await User.findById(userId).populate('memories')
  //console.log('esto es foundUser', foundUser)

  res.render('profile', foundUser)
})


>>>>>>> 44cc949576f73bbead29b1fdd85684df75cfd79c
//get ver detalles de las memories
router.get('/detail/:id', async(req, res, next) => {
  const memory= req.params.id
  const userId= req.session.currentUser._id
  //console.log('ESTO memory:', memory)

  const foundMemory= await Memory.findById(memory)//.populate('memories')
  //console.log('esto es foundMemory', foundMemory)

  res.render('detail', foundMemory)
})




module.exports= router;