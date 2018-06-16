// Typings for react-websocket
declare module 'react-websocket' {
  import * as React from 'react';

  class Websocket extends React.Component<{ url: string, onMessage: (data: any) => void}, any> {
  }
  export default Websocket;
}
