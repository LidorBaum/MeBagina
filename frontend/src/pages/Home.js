import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ParksHome } from '../cmps/ParksHome';
import { Park } from './Park';

const Stack = createNativeStackNavigator();

export const Home = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="ParksHome" component={ParksHome} />
      <Stack.Screen name="Park" component={Park} />
    </Stack.Navigator>
  );
};
