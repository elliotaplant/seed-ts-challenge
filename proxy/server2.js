var express = require('express');
var app = express();
var expressWs = require('express-ws')(app);
const GdaxSocket = require('./GdaxSocket');

// Open the GdaxSocket, start receiving data
const gdaxSocket = new GdaxSocket();
gdaxSocket.init();

app.use(express.static('../build'))

app.get('/', function(req, res, next){
  console.log('get route', req.testing);
  res.end();
});

app.ws('/', function(ws, req) {

  const messageHandlerId = gdaxSocket.onUpdate((update) => {
    ws.send(JSON.stringify(update));
  });

  connection.on('close', function(connection) {
    // close user connection
    if (messageHandlerId) {
      gdaxSocket.removeHandler(messageHandlerId);
    };
  });

  ws.on('request', function(msg) {
    console.log('request', msg);
  });
  ws.on('message', function(msg) {
    console.log('message', msg);
  });
  console.log('socket', req.testing);
});

app.listen(3030, () => console.log('connected 2!'));
