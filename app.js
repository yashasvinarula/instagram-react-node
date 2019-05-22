const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const bodyParser = require('body-parser');
const multer = require('multer');

const app = express();

// BODY PARSER MIDDLEWARE SETUP
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

// MONGODB SETUP
const keys = require('./config/keys');
mongoose
  .connect(keys.mongoURI)
  .then(() => console.log('MONGODB connected'))
  .catch(err => console.log(err));


//MULTER MIDDLEWARE TO UPLOAD FILES
const storage = multer.diskStorage({
    destination: function (req, res, cb) {
        cb(null, 'uploads/')
    }
});
const upload = multer({ storage: storage });

//PASSPORT INITIALIZATION
app.use(passport.initialize());
require('./config/passport')(passport);

// SETTING API ROUTES
const authRoutes = require('./routes/auth.js');
app.use('/auth', authRoutes);
const profileRoutes = require('./routes/profile.js');
app.use('/profile', profileRoutes);
const followerRoutes = require('./routes/follower.js');
app.use('/follow', followerRoutes);

//SETTING UP SERVER
const port = process.env.PORT || 5000;
app.listen(port, () => console.log('server active'));
