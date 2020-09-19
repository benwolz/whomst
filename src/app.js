const path = require('path');
require('dotenv').config();
const express = require('express');
const http = require('http');
const db = require('./db');
const api = require('./routes/api.js');
const socketIO = require('socket.io');
const session = require('express-session');
// const bodyParser = require('body-parser');
// const passport = require('./passport');

const Game = require('./schemas/game');
const Player = require('./schemas/player');

const app = express();
const server = http.createServer(app);
var io = socketIO(server);

app.use(session({
  secret: 'session-secret',
  resave: 'false',
  saveUninitialized: 'true'
}));

app.use(express.static('public'));
app.use('/api',api);

app.get('/', (req,res) => {
  res.sendFile(__dirname + '/views/landing/index.html');
});

app.get('/facts', (req,res) => {
    res.sendFile(`${__dirname}/views/facts/index.html`);
  });

app.get('/lobby', (req,res) => {
    res.sendFile(`${__dirname}/views/lobby/index.html`);
});

app.get('/client_shit', (req, res) => {
  res.sendFile(`${__dirname}/views/home.html`);
});

app.get('/rankings', (req,res) => {
    res.sendFile(`${__dirname}/views/rankings/index.html`);
  });

server.listen(process.env.PORT, () => {
  console.log(`Listening on localhost:${process.env.PORT}`);
});



const rooms = [];

io.on('connection', (socket) => {
  console.log('socket connected');

  socket.on('userCreateGame', (req) => {
    var gameId = Math.floor(Math.random()*900000)+100000; // Random 6 digit number
    while (rooms.includes(gameId)) {
      gameId = Math.floor(Math.random()*900000)+100000;
    }
    
    socket.room = gameId;
    rooms.push(gameId);
    socket.username = req.username;
    socket.join(gameId);

    // console.log("attempting to create game");
    // Game.find().distinct('game_id', (error, ids) => {
    //   var gameId = Math.floor(Math.random()*900000)+100000; // Random 6 digit number
    //   while(ids.includes(gameId)) {
    //     gameId = Math.floor(Math.random()*900000)+100000;
    //   }
    //   let game = new Game({
    //     game_id: gameId,
    //     host_id: socket.id,
    //     host_name: req.username,
    //     players: [socket.id]
    //   });
    //   game.save();
    //   console.log(`Game created with game pin ${gameId}`);
    // });
  });

  socket.on('userJoinGame', (req) => {
    if (rooms.includes(req.gameId)) {
      socket.join(req.gameId);
      socket.to(req.gameId).emit("newUserJoined", req.username);
    } 

    Game.findOne({game_id: req.gameId }).then(game => {
      if (game && !game.players.includes(socket.id)) {
        let player = new Player({ // Create a new player
          score: 0,
          user_id: socket.id,
          username: req.username,
          isHost: game.game_id === req.gameId,
          facts: [] // Need to add facts
        });
        player.save();
        console.log(`User ${req.username} joined game with id ${req.gameId}`);

        game.players.push(socket.id);
        game.save();
      } else {
        if(game && game.players.includes(socket.id)) {
          socket.emit("exception", {errorMessage: "Player already in the game"}); // This doesn't quite work yet
        } else { // Need to figure out how to send information back to client
          socket.emit("exception", {errorMessage: "Game pin does not exist"});
        }
      }
    });

    // add endpoint for leaving games
    // need to figure out how to send data back to the client

  })

});
