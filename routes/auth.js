const express = require('express');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');


// REGISTER NEW USER WITH EMAIL PASSWORD AND USERNAME
router.post('/register', (req, res) => {
  User
    .findOne({email: req.body.email})
    .then(userWithEmail => {
      if(userWithEmail){
        res.status(400).json({type: 'error', msg: 'Email address already taken'});
      }else{
        User
          .findOne({username: req.body.username})
          .then(userWithUsername => {
            if(userWithUsername){
              res.status(400).json({type: 'error', msg: 'Username already taken'});
            }else{
              const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                username: req.body.username,
                password: req.body.password
              })
              bcrypt.genSalt(10, function(err, salt) {
                  bcrypt.hash(req.body.password, salt, function(err, hash) {
                      if(err => console.log(err));
                      newUser.password = hash;
                      newUser
                        .save()
                        .then((user) => res.json(user))
                        .catch(err => console.log(err));
                  });
              });
            }
          })
      }
    })
})

// LOGIN WITH USERNAME AND PASSWORD
router.post('/login', (req, res) => {

  const username = req.body.username;
  const password = req.body.password;

  User
    .findOne({ username })
    .then(user => {
      if (!user) {
        return res.status(404).json({type: 'error', msg: 'User not found'});
      }

    bcrypt
      .compare(password, user.password)
      .then(isMatch => {
        if (isMatch) {
          const payload = {
            id: user.id,
            name: user.name,
            username: user.username
          };
          jwt
            .sign(
              payload,
              keys.secretOrKey,
              (err, token) => {
                res.json({
                  type: 'success',
                  token: 'Bearer ' + token
                });
              }
            );
        } else {
          return res.status(400).json({type: 'error', msg: 'Wrong Password'});
        }
      });
    });
});


router.post('/change_password',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const username = req.body.username;
    const old_password = req.body.old_password;
    const new_password = req.body.new_password;
    User
      .findOne({username: username})
      .then(user => {
        if(user){
          bcrypt
            .compare(old_password, user.password)
            .then(isMatch => {
              if(isMatch){
                bcrypt.genSalt(10, function(err, salt) {
                    bcrypt.hash(new_password, salt, function(err, hash) {
                        if(err => console.log(err));
                        user.password = hash;
                        user
                          .save()
                          .then(() => res.status(200).json({type: 'success' , msg: 'Password changed successfully'}))
                          .catch(err => console.log(err));
                    });
                });
              }else{
                res.status(400).json({type: 'error', msg: 'Wrong Password'});
              }
            })
        }else{
          res.status(404).json({type: 'error', msg: 'User not found'})
        }
      })
});


module.exports = router;
