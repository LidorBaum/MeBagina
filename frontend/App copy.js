import React, {useRef, useState, useEffect} from 'react';
import {SafeAreaView, useColorScheme} from 'react-native';
import {Colors, View, Text} from 'react-native-ui-lib';
import {NavigationContainer} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {I18nManager} from 'react-native';
import {Home} from './src/pages/Home';
import {Login} from './src/pages/Login';
import {Profile} from './src/pages/Profile';
import {AnimatedTabBarNavigator} from 'react-native-animated-nav-tab-bar';
import {Provider} from 'react-redux';
import {Store} from './src/redux/store';
import {useSelector, useDispatch} from 'react-redux';

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

const Tab = AnimatedTabBarNavigator();

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
  };
  const {loggedUser} = useSelector(state => state.userReducer);

  const TabArr = [
    {
      route: 'גינות',
      component: Home,
      iconName: 'map-marker-multiple',
      requiresLog: false,
    },
    {
      route: 'התחברות',
      component: Login,
      iconName: 'account-circle',
      requiresOut: true,
    },
    {
      route: 'פרופיל',
      component: Profile,
      iconName: 'account-circle',
      requiresLog: true,
    },
  ];

  return (
    <Provider store={Store}>
      <NavigationContainer>
        <SafeAreaView style={backgroundStyle}>
          <Tab.Navigator
            screenOptions={({route}) => ({
              tabBarActiveTintColor: 'tomato',
              tabBarInactiveTintColor: 'gray',
              headerShown: false,
              tabBarStyle: {
                height: 60,
                position: 'absolute',
                bottom: 16,
                right: 16,
                left: 16,
                borderRadius: 10,
              },
            })}
            tabBarOptions={{
              activeTintColor: Colors.violet70,
              inactiveTintColor: '#222222',
            }}
            appearance={{
              tabButtonLayout: 'horizontal',
              activeTabBackgrounds: Colors.screenBG,
              floating: true,
              horizontalPadding: 10,
            }}
          >
            {TabArr.map((item, index) => {
              if (loggedUser && item.requiresLog) {
                return (
                  <Tab.Screen
                    key={index}
                    name={item.route}
                    component={item.component}
                    options={{
                      tabBarIcon: ({color, focused}) => (
                        <MaterialCommunityIcons
                          name={
                            focused ? item.iconName : item.iconName + '-outline'
                          }
                          size={30}
                          color={color}
                        />
                      ),
                    }}
                  />
                );
              } else if (loggedUser && item.requiresOut) return;
              else
                return (
                  <Tab.Screen
                    key={index}
                    name={item.route}
                    component={item.component}
                    options={{
                      tabBarIcon: ({color, focused}) => (
                        <MaterialCommunityIcons
                          name={
                            focused ? item.iconName : item.iconName + '-outline'
                          }
                          size={30}
                          color={color}
                        />
                      ),
                    }}
                  />
                );
            })}
          </Tab.Navigator>
        </SafeAreaView>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
