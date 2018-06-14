const WebSocketServer = require('websocket').server;
const http = require('http');
const GdaxSocket = require('./GdaxSocket');

// Open the GdaxSocket, start receiving data
const gdaxSocket = new GdaxSocket();
gdaxSocket.init();

const server = http.createServer(function(request, response) {
  // process HTTP request. Since we're writing just WebSockets
  // server we don't have to implement anything.
});

server.listen(1337, function() {
  console.log('connected!');
});

// create the server
wsServer = new WebSocketServer({httpServer: server});

// WebSocket server
wsServer.on('request', function(request) {
  const connection = request.accept(null, request.origin);
  const messageHandlerId = gdaxSocket.onUpdate((update) => {
    connection.sendUTF(JSON.stringify(update));
  });


  connection.on('close', function(connection) {
    // close user connection
    if (messageListenerId) {
      gdaxSocket.removeHandler(messageHandlerId);
    };
  });
});
