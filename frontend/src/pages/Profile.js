import React, {useEffect, useState} from 'react';
import {View, Text, Button} from 'react-native-ui-lib';
import {useSelector, useDispatch} from 'react-redux';
import {setLoggedUser} from '../redux/actions';
import auth from '@react-native-firebase/auth';
import userService from '../services/userService';

export function Profile() {
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
      .then(() => console.log('User signed out!'));
  };

  return (
    <View>
      <Text>Welcome {JSON.stringify(loggedUser.name)}</Text>
      <Button label="signout" onPress={signOut} />
    </View>
  );
}
