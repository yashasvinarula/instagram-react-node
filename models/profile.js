const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const profileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  bio: {
    type: String,
  },
  website: {
    type: String,
  },
  profilePic: {
    type: String
  },
  open_acc: {
    type: Boolean,
    default: true
  },
  created_on: {
    type: Date,
    default: Date.now()
  }
});

module.exports = Profile = mongoose.model('Profile', profileSchema);
