const express = require('express');
const app = express();
const expressWs = require('express-ws')(app);
const GdaxSocket = require('./GdaxSocket');
const PORT = process.env.PORT || 3030;

// Open the GdaxSocket, start receiving data
const gdaxSocket = new GdaxSocket();
gdaxSocket.init();

// Tell the express server where to retreive static files
app.use(express.static('../build'))

// Tell the app how to handle WebSocket requests
app.ws('/', (ws) => {
  // Add a listener to the update event of the GdaxSocket
  const messageHandlerId = gdaxSocket.onUpdate((update) => {
    try {
      // Attempt to relay the updated GdaxSocket state to the FE WebSocket
      ws.send(JSON.stringify(update));
    } catch (error) {
      console.error('Failed to send update');
    }
  });

  // When the WebSocket closes, remove the handler from the GdaxSocket
  ws.on('close', (connection) => {
    if (messageHandlerId) {
      gdaxSocket.removeHandler(messageHandlerId);
    };
  });
});

// Start the express server on the specified PORT
app.listen(PORT, () => console.log(`App listening on ${PORT}`));
