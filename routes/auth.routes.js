const express= require('express')
const router= express.Router()

const mongoose= require('mongoose')

const User= require('../models/User.model')

const bcrypt= require('bcrypt')
const saltRounds= 10

//Ruta GET de signup (lleva al usuario a la forma para registrarse)
router.get('/signup', (re, res, next) => {
  res.render('auth/signup')
})

//Ruta POST SIgnup (Procesa la info de la forma)
router.post('/signup', async(req, res, next) => {
  const {username, email, password}= req.body
  //console.log({username, email, password})

  if (!username || !email || !password) {
    res.render('auth/signup', { errorMessage: 'All fields are mandatory. Please provide your username, email and password.' });
    return;
  }

  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    res
      .status(500)
      .render('auth/signup', { errorMessage: 'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.' });
    return;
  }

  try{
  const genSaltResult= await bcrypt.genSalt(saltRounds);
  const hashPassword= await bcrypt.hash(password, genSaltResult)

  const user= await User.create({
    username: username,
    password: hashPassword,
    email: email
  })
  req.session.currentUser = user
  res.redirect('/profile')
}
catch(error) {
  if (error instanceof mongoose.Error.ValidationError) {
      res.status(500).render('users/signup', { errorMessage: error.message });
  } else if (error.code === 11000) {
      res.status(500).render('auth/signup', {
         errorMessage: 'Username and email need to be unique. Either username or email is already used.'
      });
    } else {
      next(error);
  }
}
})

//Get Login (le da al usuario el formulario de login)
router.get('/login', (req, res, next) => {
  //const userInSession= req.session.currentUser
  res.render("auth/login")
})

//Post de Login (procesa los datos del formulario que nos da el usuario)
router.post('/login', async (req, res, next) => {
  //console.log('SESSION =====> ', req.session);
  const {email, password} = req.body

  if (email === '' || password === '') {
    res.render('auth/login', {
      errorMessage: 'Please enter both, email and password to login.'
    });
    return;
  }

  const userInDB= await User.findOne({email});
  if (!userInDB){
    res.render('auth/login', { errorMessage: 'Email is not registered. Try with other email.' });
  }

  const match= await bcrypt.compareSync(password, userInDB.password)
  if(match){
     req.session.currentUser = userInDB 
      console.log("ESTO ME IMPRIME LA COOKIE ====>", req.session.currentUser)
      res.redirect("/profile")
  }else {
    res.render('auth/login', { errorMessage: 'Incorrect password.' });
  }
})

//get profile 
router.get('/profile', async(req, res, next) => {
  const userInSession= req.session.currentUser
  //console.log('Esto es req.session:', req.sesseion, 'esto es req.session.currentUser:', userInSession)
  const userId= req.session.currentUser._id
  const foundUser= await User.findById(userId).populate('memories')
  //console.log('esto es foundUser', foundUser)

  res.render('profile', foundUser)
})


//Post logout
router.post('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});



module.exports= router