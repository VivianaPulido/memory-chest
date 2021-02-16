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
router.post('/create-memory', uploadCloud.single('image'), async(req, res, next) => {
  const {title, description}= req.body
  const imgPath= req.file.url
  const imgName= req.file.originalname
  const userId= req.session.currentUser.id

  const newMemory= await new Memory({title, imgPath, imgName, description})
  await User.findById(userId, { $push: { memories: newMemory}})

  res.redirect('/profile')
})

//get profile
router.get('/profile', (req, res, next) => {
  const userInSession= req.session.currentUser
  res.render('profile', {userInSession})
})

module.exports= router;