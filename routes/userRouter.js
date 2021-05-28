const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/usersModel');

const userRouter = express.Router();
const BCRYPT_SALT_ROUNDS = 12;

userRouter.post('/editar', async (req, res) => {
  const {name, email, password, id} = req.body;
  await User.updateOne({_id: id}, {name: `${name}`, email: email});
  res.send("<script>localStorage.removeItem('userData'); window.location.href='/appPrestamos';</script>")
});

userRouter.post('/delete', async (req, res)=>{
  await User.deleteOne({_id: req.body.id});
  res.send("<script>localStorage.removeItem('userData'); window.location.href='/appPrestamos';</script>")
})

userRouter.post('/register', async (req, res) => {
  const {name, email, password} = req.body;
  try{
    userRegistered = await User.findOne({
      email: email
    });
    
    if(!userRegistered){
      const {name, email, password} = req.body;
      bcrypt.hash(password, BCRYPT_SALT_ROUNDS).then((hashedPassword) => {
        let userData = {
          name: escape(name),
          email: escape(email),
          password: hashedPassword
        }
  
        User.create(userData).then(userCreated => {
          if(userCreated){
            res.send({msg: "User registered succesfully", code: 200, data: userCreated});
          }  
          else{
            res.send({msg: "An error has ocurred in the process", code: 500});
          }
        });

       
      });
    }
    else{
      res.send({msg: "User is already registered", code: 409})
    }
  }
  catch(error){
    console.log(error);
  }
});

userRouter.post('/login', async (req, res) => {
  const {email, password} = req.body;
  try{
    userSignIn = await User.findOne({
      email: email
    });

    if(userSignIn){
      bcrypt.compare(password, userSignIn.password)
        .then((response) => {
          if(response === false){
            res.send({msg: "Invalid email or password", code: 401});
          }
          else{
            res.send({msg: "User signed succesfully", code: 202, data: userSignIn});
          }
        })
    }
    else{
      res.send({msg: "Invalid email or password", code: 401});
    }
  }
  catch(error){
    console.log(error);
  }
});

module.exports = userRouter;
