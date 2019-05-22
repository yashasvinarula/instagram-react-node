const express = require('express');
const router = express.Router();
const passport = require('passport');
const Follower = require('../models/follower');


router.post('/send_req',
  passport.authenticate('jwt', {session: false}),
  (req, res) => {
    const follower = req.user._id;
    const user_to_be_followed = req.body.user_to_be_followed;
    const followerData = {
      user: user_to_be_followed,
      follower
    }
    const newFollower = new Follower(followerData);
    // newFollower
    //   .save()
    //   .then(() => res.json({}))
  }
)

module.exports = router;
