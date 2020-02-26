import React from 'react';
import { AppRegistry } from 'proton-native';
import Example from './src/app';

AppRegistry.registerComponent('example', <Example />); // and finally render your main component

// ================================================================================
// This is for hot reloading (this will be stripped off in production by webpack)
// THIS SHOULD NOT BE CHANGED
if (module.hot) {
  module.hot.accept(['./src/app'], function() {
    const app = require('./src/app')['default'];
    AppRegistry.updateProxy(app);
  });
}
