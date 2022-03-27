import React, {useEffect, useState} from 'react';

import {Colors} from 'react-native-ui-lib';
import {I18nManager} from 'react-native';
import {Provider} from 'react-redux';
import {Store} from './src/redux/store';
import {Navigator} from './src/pages/Navigator';
import auth from '@react-native-firebase/auth';
import userService from './src/services/userService';
import {darkMap, lightMap} from './src/services/utils';

Colors.loadSchemes({
  light: {
    screenBG: Colors.blue80,
    textColor: Colors.grey10,
    moonOrSun: Colors.yellow30,
    mapMarker: Colors.red30,
    tabBarText: Colors.violet40,
    mountainForeground: Colors.green30,
    mountainBackground: Colors.green50,
    cardBG: '#13678A',
    navigatorBG: '#45C4B0',
    error: Colors.red30,
    success: Colors.green40,
    warn: Colors.yellow30,
    info: Colors.violet40,
    map: lightMap,
  },
  dark: {
    screenBG: '#012030',
    textColor: Colors.grey70,
    moonOrSun: Colors.blue50,
    mapMarker: Colors.red30,
    tabBarText: '#9AEBA3',
    mountainForeground: Colors.violet10,
    mountainBackground: Colors.violet70,
    cardBG: '#13678A',
    navigatorBG: '#45C4B0',
    error: Colors.red30,
    success: Colors.green40,
    warn: Colors.yellow30,
    info: Colors.violet40,
    map: darkMap,
  },
});

I18nManager.forceRTL(true);

const App = () => {
  const [firebaseUID, setFirebaseUID] = useState(null);

  async function onAuthStateChanged(user) {
    console.log(user, 'line 37 app');
    setFirebaseUID(user?.uid);
  }

  useEffect(() => {
    auth().onAuthStateChanged(onAuthStateChanged);
  }, []);

  return (
    <Provider store={Store}>
      <Navigator firebaseUID={firebaseUID} />
    </Provider>
  );
};

export default App;
