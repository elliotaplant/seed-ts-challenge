// Patch for https://github.com/reduxjs/redux/issues/2740

import * as redux from 'redux';

declare module 'redux' {
  export type GenericStoreEnhancer = any;
}
