const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const followerSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  follower: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  created_on: {
    type: Date,
    default: Date.now()
  }
});

module.exports = Follower = mongoose.model('Follower', followerSchema);
