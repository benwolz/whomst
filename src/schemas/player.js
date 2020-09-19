// import node modules
const mongoose = require('mongoose');

// define Player schema
const Player = new mongoose.Schema ({
  score: Number,
  user_id: String,
  username: String,
  game_id: Number,
  isHost: Boolean,
  facts: Array
});

// compile model from schema
module.exports = mongoose.model('Player', Player);