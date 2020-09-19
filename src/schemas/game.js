// import node modules
const mongoose = require('mongoose');

// define Game schema
const Game = new mongoose.Schema ({
  game_id: Number,
  host_id: String,
  host_name: String,
  players: Array,
  factList: Array,
  isStarted: Boolean,
  factIndex: Number
});

// compile model from schema
module.exports = mongoose.model('Game', Game);