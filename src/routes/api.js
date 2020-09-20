const express = require("express");
const router = express.Router();
const _ = require("lodash");

const Game = require('../schemas/game');
const Player = require('../schemas/player');
const { random } = require("lodash");

router.get('/test', (req, res) => {
  console.log('testing api works');
  console.log(req.session.id);
  res.send({ test: 'testicle' });
});

router.post('/create-game', (req, res) => {
  console.log("attempting to create game");
  console.log(req.body);
  Game.find().distinct('game_id', (error, ids) => {
    var gameId = Math.floor(Math.random() * 900000) + 100000; // Random 6 digit number
    while (ids.includes(gameId)) {
      gameId = Math.floor(Math.random() * 900000) + 100000;
    }
    let game = new Game({
      game_id: gameId,
      host_id: req.session.id,
      host_name: req.body.username,
      players: [req.session.id],
      factList: [],
      isStarted: false,
      factIndex: 0
    });
    game.save();
    console.log(`Game created with game pin ${gameId}`);

    let player = new Player({ // Create a new player
      score: 0,
      user_id: req.session.id,
      username: req.body.username,
      isHost: true,
      facts: req.body.facts,
      game_id: gameId,
      hasSubmitted: false
    });
    player.save();
    console.log(`User ${req.body.username} joined game with id ${gameId}`);


    res.send({
      status: 'ok',
      gameId: gameId
    });
  });
});

router.post('/join-game', (req, res) => {
  console.log("Attempting to join a game");
  Game.findOne({ game_id: req.body.gameId }).then(game => {
    if (game && !game.players.includes(req.session.id)) {
      let player = new Player({ // Create a new player
        score: 0,
        user_id: req.session.id,
        username: req.body.username,
        isHost: game.game_id === req.body.gameId,
        facts: req.body.facts, // Need to add facts
        hasSubmitted: false
      });
      player.save();
      console.log(`User ${req.body.username} joined game with id ${req.body.gameId}`);

      game.players.push(req.session.id);
      game.save();
    } else {
      if (game && game.players.includes(req.session.id)) {
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
    if (player) {
      res.send({ score: player.score });
    } else {
      res.send({ status: 'error', errorMessage: "Player Not Found" });
    }
  });
});

router.get('/game-info', (req, res) => {
  Player.findOne({ user_id: req.session.id }).then(player => {
    if (player) {
      Game.findOne({ game_id: player.game_id }).then(game => {
        const usernames = []
        for (let player of game.players) {
          usernames.push(Player.findOne({ user_id: player }).then(p => {
            return p.username;
          }));
        }
        console.log(usernames);
        Promise.all(usernames).then(users => {
          console.log(users);
          res.send({
            game_id: game.game_id,
            host_id: game.host_id,
            players: users,
            isStarted: game.isStarted,
            isHost: game.host_id === req.session.id
          });
        });
      });
    } else {
      res.send({ status: 'error', errorMessage: "Player Not Found" });
    }
  });
});

router.post('/start-game', (req, res) => {
  Player.findOne({ user_id: req.session.id }).then(player => {
    if (player && player.isHost) {
      Game.findOne({ game_id: player.game_id }).then(game => {
        let factList = []; // Not sure if this will work
        for (let gamePlayer of game.players) {
          factList.push(Player.findOne({ user_id: gamePlayer }).then(playerData => {
            if (playerData) {
              let onePlayerFacts = []
              for (let fact of playerData.facts) {
                onePlayerFacts.push({
                  player: playerData.user_id,
                  fact: fact
                });
              }
              return onePlayerFacts;
            }
          }));

          Promise.all(factList).then(fList => {
            fList = _.flattenDeep(fList);
            fList = _.shuffle(fList);
            game.isStarted = true;
            game.factIndex = 0;
            game.fList = fList.slice(0, Math.min(fList.length, 10)); // take the first 10 fact
            game.save();
          })
        }
      });
    }
  })
});

router.get('/get-fact', (req, res) => {
  console.log(req);
  Player.findOne({user_id: req.session.id}).then(player => {
    if (player) {
      Game.findOne({game_id: player.game_id}).then(game => {
        var fact_index = game.factIndex;
        real_fact = game.factList[fact_index];
        players = game.players;
        const shuffled = _.shuffle(players);
        shuffled = shuffled.filter((elem) => elem != player.user_id).slice(0, 3);
        Player.findOne({user_id: shuffled[0]}).then(player1 => {
          Player.findOne({user_id: shuffled[1]}).then(player2 => {
            Player.findOne({user_id: shuffled[2]}).then(player3 => {
              res.send({fact: real_fact, round: fact_index, 
                                          player0: {username: player.username, id: player.user_id}, 
                                          player1: {username: player1.username, id: player1.user_id},
                                          player2: {username: player2.username, id: player2.user_id},
                                          player3: {username: player3.username, id: player3.user_id}});
            });
          });
        });
      });
    } else {
      res.send({ status: 'error', errorMessage: "Player Not Found" });
    }
  });
});

router.get('/leaderboard', (req,res) => {
  Player.findOne({user_id: req.session.id }).then(p => {
    if (p) {
      Game.findOne({ game_id: player.game_id}).then(game => {
        let scores = []
        if (game) {
          for (let player of game.players) {
            scores.push({ username: player.username, score: player.score });
          }

          scores.sort((a,b) => {
            return ((a.score < b.score) ? 1 : ((a.score > b.score) ? -1 : 0));
          });

          res.send({
            leaderboard: scores
          });
        } else {
          res.send({
            status: 'error',
            errorMessage: 'Player not in a game'
          });
        }
      });
    } else {
      res.send({
        status: 'error',
        errorMessage: 'No player found'
      });
    }
  });
});

router.post('/exit-game', (req, res) => {
  Player.deleteOne({ user_id: req.session.id }, function (err) {
    if(err) {
      console.log(err);
      res.send({
        status: 'error',
        errorMessage: 'No player found'
      });
    }
    console.log("Successful deletion");
  });
  Game.findOne({ players: req.session.id  }).then(game => { // TODO test this, IDK if it works
    if(game) {
      const index = game.players.indexOf(req.session.id);
      if (index > -1) {
        game.players.splice(index, 1);
      }
      game.save();
      res.send({});
    } else {
      res.send({
        status: 'error',
        errorMessage: 'Player not in any games'
      })
    }
  });
});


router.post('/answer', (req, res) => {
  const answer = req.body.answer_id;
  Player.findOne({ user_id: req.session.id }).then(p => {
    if (p) {
      Game.findOne({ game_id: p.game_id}).then(game => {
        const {player, fact} = game.factList[game.gameIndex];
        p.hasSubmitted = true;
        if (answer === player) {
          p.score += 1000; // increment score
        }
        p.save();
        res.send({});
      });
    } else {
      res.send({
        status: 'error',
        errorMessage: 'No player found'
      });
    }
  });
});

router.post('/next-round', (req, res) => {
  Player.findOne({ user_id: req.session.id }).then(p => {
    if (p) {
      Game.findOne({ game_id: p.game_id}).then(game => {
        if(game) {
          let allSubmitted = true;
          for (let player of game.players) {
            Player.findOne({ user_id: player }).then(x => {
              allSubmitted = allSubmitted && x.hasSubmitted;
            });
          }

          if(!allSubmitted) {
            res.send({
              status: 'failed',
              error: 412,
              errorMessage: 'Not everyone has submitted an answer yet'
            });
          }

          for (let player of game.players) {
            Player.findOne({ user_id: player }).then(x => {
              x.hasSubmitted = false;
              x.save();
            });
          }

          game.factIndex += 1;
          game.save();
          if (game.factIndex >= factList.length) {
            res.send({
              gameOver: true
            });
          } else {
            res.send({
              gameOver: false
            })
          }
        } else {
          res.send({
            status: 'error',
            errorMessage: 'No game found'
          });
        }
      });
    } else {
      res.send({
        status: 'error',
        errorMessage: 'No player found'
      });
    }
  });
});

module.exports = router;