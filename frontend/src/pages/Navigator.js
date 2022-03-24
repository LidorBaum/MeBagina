import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Home } from './Home';
import { Login } from './Login';
import { Profile } from './Profile';
import { SafeAreaView, useColorScheme } from 'react-native';
import { Colors } from 'react-native-ui-lib';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { AnimatedTabBarNavigator } from 'react-native-animated-nav-tab-bar';
import { useSelector, useDispatch } from 'react-redux';
import userService from '../services/userService';
import { setLoggedUser } from '../redux/actions';

const Tab = AnimatedTabBarNavigator();

export function Navigator({ firebaseUID }) {
    const dispatch = useDispatch();

    const isDarkMode = useColorScheme() === 'dark';
    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
        flex: 1,
        // position: 'absolute' 
    };
    const { loggedUser } = useSelector(state => state.userReducer);
    useEffect(() => {
        const getUserFromDB = async () => {
            if (firebaseUID) {
                const userFromDB = await userService.getByFirebaseUID(firebaseUID);
                if (userFromDB.error) console.log('error fetching from db');
                dispatch(setLoggedUser(userFromDB));
            }
        }
        getUserFromDB()
    }, [firebaseUID])

    const TabArr = [
        {
            name: 'Home',
            route: 'גינות',
            component: Home,
            iconName: 'map-marker-multiple',
            requiresLog: false,
        },
        {
            name: 'Login',
            route: 'התחברות',
            component: Login,
            iconName: 'account-circle',
            requiresOut: true,
        },
        {
            name: 'Profile',
            route: 'פרופיל',
            component: Profile,
            iconName: 'paw',
            requiresLog: true,
        },
    ];

    return (
        <NavigationContainer>
            <SafeAreaView style={backgroundStyle}>
                <Tab.Navigator
                    screenOptions={({ route }) => ({
                        tabBarActiveTintColor: 'tomato',
                        tabBarInactiveTintColor: 'gray',
                        tabBarHideOnKeyboard: true,
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
                        keyboardHidesTabBar: true,
                        inactiveTintColor: '#222222',
                    }}
                    appearance={{
                        tabButtonLayout: 'horizontal',
                        activeTabBackgrounds: Colors.screenBG,
                        floating: false,
                        horizontalPadding: 10,
                        tabBarBackground: Colors.violet70
                    }}
                >
                    {TabArr.map((item, index) => {
                        if (!loggedUser && item?.requiresOut) {
                            return (
                                <Tab.Screen
                                    key={index}
                                    name={item.route}
                                    component={item.component}
                                    options={{
                                        tabBarIcon: ({ color, focused }) => (
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
                        } else if (loggedUser && item?.requiresLog) {
                            return (
                                <Tab.Screen
                                    key={index}
                                    name={item.route}
                                    component={item.component}
                                    options={{
                                        tabBarIcon: ({ color, focused }) => (
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
                        } else if (!loggedUser && item?.requiresLog) return;
                        else if (loggedUser && item?.requiresOut) return;
                        else {
                            return (
                                <Tab.Screen
                                    key={index}
                                    name={item.route}
                                    component={item.component}
                                    options={{
                                        tabBarIcon: ({ color, focused }) => (
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
                        }
                    })}
                </Tab.Navigator>
            </SafeAreaView>
        </NavigationContainer>
    );
}
