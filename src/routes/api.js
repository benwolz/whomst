const express = require("express");
const router = express.Router();
const _ = require("lodash");

const Game = require('../schemas/game');
const Player = require('../schemas/player');

router.get('/test', (req, res) => {
  console.log('testing api works');
  console.log(req.session.id);
  res.send({});
});

router.post('/create-game', (req, res) => {
  console.log("attempting to create game");
    Game.find().distinct('game_id', (error, ids) => {
      var gameId = Math.floor(Math.random()*900000)+100000; // Random 6 digit number
      while(ids.includes(gameId)) {
        gameId = Math.floor(Math.random()*900000)+100000;
      }
      let game = new Game({
        game_id: gameId,
        host_id: req.session.id,
        host_name: req.username,
        players: [req.session.id]
      });
      game.save();
      console.log(`Game created with game pin ${gameId}`);

      let player = new Player({ // Create a new player
        score: 0,
        user_id: req.session.id,
        username: req.username,
        isHost: true,
        facts: req.facts
      });
      player.save();
      console.log(`User ${req.username} joined game with id ${req.gameId}`);

      
      res.send({
        status: 'ok',
        gameId: gameId
      });
    });
});

router.post('/join-game', (req, res) => {
  console.log("Attempting to join a game");
  Game.findOne({game_id: req.gameId }).then(game => {
    if (game && !game.players.includes(req.session.id)) {
      let player = new Player({ // Create a new player
        score: 0,
        user_id: req.session.id,
        username: req.username,
        isHost: game.game_id === req.gameId,
        facts: req.facts // Need to add facts
      });
      player.save();
      console.log(`User ${req.username} joined game with id ${req.gameId}`);

      game.players.push(req.session.id);
      game.save();
    } else {
      if(game && game.players.includes(req.session.id)) {
        res.send({
          status: 'failed',
          errorMessage: 'Player already in game',
          error: 0
        })
      } else { // Need to figure out how to send information back to client
        res.send({
          status: 'failed',
          errorMessage: 'Game does not exist',
          error: 1
        })
      }
    }
  });
});

router.get('/score', (req, res) => {
  Player.findOne({ user_id: req.session.id }).then(player => {
    if(player) {
      res.send({score: player.score});
    } else {
      res.send({status: 'error', errorMessage:"Player Not Found"});
    }
  });
});

router.get('/game-info', (req, res) => {
  Player.findOne({ user_id: req.session.id }).then(player => {
    if (player) {
      Game.findOne({ game_id: player.game_id }).then(game => {
        res.send({
          game_id: game.game_id,
          host_id: game.host_id,
          players: game.players,          
          isStarted: game.isStarted
        });
      });
    } else {
      res.send({ status: 'error', errorMessage:"Player Not Found" });
    }
  });
});

router.get('/start-game', (req, res) => {
  Player.findOne({ user_id: req.session.id }).then(player => {
    if (player && player.isHost) {
      Game.findOne({ game_id: player.game_id }).then(game => {
        let factList = []; // Not sure if this will work
        for(let gamePlayer of game.players) {
          Player.findOne({ user_id: gamePlayer }).then(playerData => {
            if(playerData) {
              for (let fact of playerData.facts) {
                factList.push({
                  player: playerData.user_id,
                  fact: fact
                });
              }
            }
          });
        }

        factList = _.shuffle(factList);
        game.isStarted = true;
        game.factIndex = 0;
        game.factList = factList.slice(0,10); // take the first 10 fact
        game.save();
      });
    }
  })
});

module.exports = router;