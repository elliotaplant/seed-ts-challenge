import GdaxSocket from './GdaxSocket';

const gdaxSocket = new GdaxSocket(
  (data) => console.log('data', data),
  (error) => console.error(error),
  () => console.log('Socket closed')
);

export default gdaxSocket;
