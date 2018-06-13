const GdaxSocket = require('./GdaxSocket');

const gdaxSocket = new GdaxSocket(
  (data) => console.log('snapshot', data),
  (data) => console.log('update', data),
  (error) => console.error(error),
  () => console.log('Socket closed')
);
