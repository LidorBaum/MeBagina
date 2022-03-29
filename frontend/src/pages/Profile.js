import React, {useEffect, useState} from 'react';
import {View, Text, Button, Colors} from 'react-native-ui-lib';
import {useSelector, useDispatch} from 'react-redux';
import {setLoggedUser} from '../redux/actions';
import auth from '@react-native-firebase/auth';

export function Profile({navigation}) {
  console.log('navigation', navigation);

  const {loggedUser} = useSelector(state => state.userReducer);
  const dispatch = useDispatch();
  if (!loggedUser) {
    return (
      <View>
        <Text>NO LOGGED USER</Text>
      </View>
    );
  }

  async function onAuthStateChanged(user) {
    if (!user) dispatch(setLoggedUser(null));
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  const signOut = () => {
    auth()
      .signOut()
      .then(() => {
        console.log('navigating');
        navigation.navigate('גינות');
      });
  };

  return (
    <View flex center>
      <Text>Welcome {loggedUser.name}</Text>
      <Button
        label="signout"
        style={{backgroundColor: Colors.navigatorBG, width: 150}}
        onPress={signOut}
      />
    </View>
  );
}
