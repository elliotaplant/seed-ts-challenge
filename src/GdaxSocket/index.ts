import GdaxSocket from './GdaxSocket';

const gdaxSocket = new GdaxSocket(
  (data) => console.log('snapshot', data),
  (data) => console.log('update', data),
  (error) => console.error(error),
  () => console.log('Socket closed')
);

export default gdaxSocket;
