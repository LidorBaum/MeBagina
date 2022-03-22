import React from 'react';

import {Colors} from 'react-native-ui-lib';
import {I18nManager} from 'react-native';
import {Provider} from 'react-redux';
import {Store} from './src/redux/store';
import {Navigator} from './src/pages/Navigator';

Colors.loadSchemes({
  light: {
    screenBG: Colors.blue80,
    textColor: Colors.grey10,
    moonOrSun: Colors.yellow30,
    mapMarker: Colors.red30,
    tabBarText: Colors.violet40,
    mountainForeground: Colors.green30,
    mountainBackground: Colors.green50,
  },
  dark: {
    screenBG: Colors.grey10,
    textColor: Colors.white,
    moonOrSun: Colors.blue50,
    mapMarker: Colors.red30,
    tabBarText: Colors.violet40,
    mountainForeground: Colors.violet10,
    mountainBackground: Colors.violet70,
  },
});

I18nManager.forceRTL(true);

const App = () => {
  return (
    <Provider store={Store}>
      <Navigator />
    </Provider>
  );
};

export default App;
