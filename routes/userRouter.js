const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/usersModel');

const userRouter = express.Router();
const BCRYPT_SALT_ROUNDS = 12;

userRouter.post('/register', async (req, res) => {
  const {name, email, password} = req.body;
  console.log(req.body);
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
  
        const userCreated = User.create(userData);
        console.log(userCreated);

        if(userCreated){
          res.send({msg: "User registered succesfully", code: 200, data: userCreated});
        }

        else{
          res.send({msg: "An error has ocurred in the process", code: 500});
        }
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
