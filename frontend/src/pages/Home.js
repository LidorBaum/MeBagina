import React, {useState, useEffect, useRef} from 'react';
import {Colors} from 'react-native-ui-lib';
import GetLocation from 'react-native-get-location';

import {Animated} from 'react-native';

import {Text, Button, Image, Toast, View} from 'react-native-ui-lib'; //eslint-disable-line

import MapView, {Callout, Marker} from 'react-native-maps';
import parkService from '../services/parkService';
import {ParkList} from '../cmps/ParkList';
import {useSelector, useDispatch} from 'react-redux';
import {newNotification} from '../redux/actions';
import {toastServerError} from '../services/utils';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ParksHome} from '../cmps/ParksHome';
import {Park} from './Park';

const Stack = createNativeStackNavigator();

export const Home = ({navigation}) => {
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
