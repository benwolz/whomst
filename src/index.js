const path = require('path');
require('dotenv').config();
const express = require('express');
const http = require('http');
const db = require('./db');
const api = require('./routes/api.js');
const socketIO = require('socket.io');
// const api = require('./routes/api');
// const bodyParser = require('body-parser');
// const passport = require('./passport');

const app = express();
const server = http.createServer(app);
var io = socketIO(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/home.html');
});
app.use('/api',api);


server.listen(process.env.PORT, () => {
  console.log(`Listening on localhost:${process.env.PORT}`);
});

io.listen(server);

io.on('connection', (socket) => {
  console.log('socket connected');
});

// Connections
// app.use('/static', express.static('public'));
// app.use('/api', api);
// app.engine('html', require('ejs').renderFile);
// app.set('views', __dirname + '/views');
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

// app.use(session({
//   secret: 'session-secret',
//   resave: 'false',
//   saveUninitialized: 'true'
// }));

// hook up passport
// app.use(passport.initialize());
// app.use(passport.session());

// authentication routes
// app.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));

// app.get(
//   '/auth/google/callback',
//   passport.authenticate(
//     'google',
//     { failureRedirect: '/login' }
//   ),
//   function(req, res) {
//     res.redirect('/feed');
//   }
// );


// app.get('/logout', function(req, res) {
//   req.logout();
//   res.redirect('/');
// });

// 404 route
// app.use(function(req, res, next) {
//   const err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });
// 
// // route error handler
// app.use(function(err, req, res, next) {
//   res.status(err.status || 500);
//   res.send({
//     status: err.status,
//     message: err.message,
//   });
// });
// 
// const PORT = 3000;
// server = http.Server(app);
// server.listen(PORT,function() {
//   console.log('server listening on port ' + PORT);
// })
