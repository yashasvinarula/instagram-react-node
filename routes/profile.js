const express = require('express');
const passport = require('passport');
const fs = require('fs');
const router = express.Router();
const User = require('../models/user');
const Profile = require('../models/profile');


const path = require("path");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: './files',
  filename(req, file, cb) {
    cb(null, `${new Date()}-${file.originalname}`);
  },
});

const upload = multer({ storage });


// router.post('/photo', upload.single('file'), (req, res) => {
//   console.log(req.file);
// });


router.post('/create_profile', (req, res) => {
  const user = req.body.user;
  User
    .findById(user)
    .then(searchedUser => {
      if(searchedUser){
        const newProfile = new Profile({
          user: user,
          name: req.body.name,
          username: req.body.username,
          bio: '',
          website: '',
          profilePic: ''
        });
        newProfile
          .save()
          .then(profile => res.json(profile))
          .catch(err => console.log(err));

      }
    })
    .catch(err => res.status(404).json({msg: 'user not found'}))
});

router.get('/:username',
  passport.authenticate('jwt', {session: false}),
  (req, res) => {
    const username = req.params.username;
    Profile
      .findOne({username})
      .then(data => {
        data['password'] = null
        res.json(data)
      })
      .catch(err => console.log(err));
  }
)

router.post('/update_profile',
  passport.authenticate('jwt', {session: false}),
  (req, res) => {
    const username = req.body.username;
    const name = req.body.name;
    const website = req.body.website;
    const bio = req.body.bio;
    const id = req.user._id;
    Profile
      .findOne({user: id})
      .then(profile => {
        Profile
          .findOne({username})
          .then(p => {
            if(p.user.toString() == id){
              p.name = name;
              p.website = website;
              p.bio = bio;
              p.save();
              User
                .findById(id)
                .then(user => {
                  user.name = name;
                  user.username = username;
                  user.save();
                })
              return res.status(200).json({username});
            }else{
              return res.status(400).json({msg: 'Username not available'});
            }
          })
          .catch(err => {
            profile.username = username;
            profile.name = name;
            profile.website = website;
            profile.bio = bio;
            profile.save();
            User
              .findById(id)
              .then(user => {
                user.name = name;
                user.username = username;
                user.save();
              })
            return res.status(200).json({username});
          })
      })
      .catch(err => console.log(err));
  }
)

router.post('/photo',
  passport.authenticate('jwt', {session: false}),
  // upload.single('file'),
  (req, res) => {
    const id = req.user._id;
    console.log(req.file);
    Profile
      .findOne({user: id})
      .then(profile => {
        profile.profilePic = req.body.imageURL
        profile
          .save()
          .then(() => res.status(200).json({msg: 'success'}))
          .catch(err => res.status(400).json({msg: 'error'}));
      })
});

router.get('/',
  passport.authenticate('jwt', {session: false}),
  (req, res) => {
    const id = req.user._id;
    Profile.findOne({user: id})
    .then(profile => res.status(200).json({profile}))
    .catch(err => res.status(404).json({msg: 'not'}))
  }
)


module.exports = router;
