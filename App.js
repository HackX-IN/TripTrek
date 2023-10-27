import React from 'react';
import {LogBox, Text, View} from 'react-native';
import {Provider} from 'react-redux';
import AppNavigation from './navigation/appNavigation';
import {store} from './redux/store';

function App() {
  LogBox.ignoreAllLogs();
  return (
    <Provider store={store}>
      <AppNavigation />
    </Provider>
  );
}

export default App;
