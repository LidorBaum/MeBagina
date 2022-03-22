import React, {useEffect, useState} from 'react';
import {View, Text, Button} from 'react-native-ui-lib';
import {Colors} from 'react-native-ui-lib';
import auth from '@react-native-firebase/auth';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId:
    '147926405452-9nolh1ovp3t7jcf3bbaga64gq4lnkdrs.apps.googleusercontent.com',
});
import {useSelector, useDispatch} from 'react-redux';
import {setLoggedUser} from '../redux/actions';
import userService from '../services/userService';

export function Login({navigation: {navigate}}) {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const {loggedUser} = useSelector(state => state.userReducer);
  const dispatch = useDispatch();

  // Handle user state changes
  async function onAuthStateChanged(user) {
    console.log(user?.uid, 'user after auth change');
    if (!user) dispatch(setLoggedUser(null));
    else {
      const userFromDB = await userService.getByFirebaseUID(user.uid);
      if (userFromDB.error) console.log('error fetching from db');
      // dispatch(setLoggedUser({ ...userFromDB, ...user }))
      dispatch(setLoggedUser(userFromDB));
      console.log(navigate);
    }
    if (initializing) setInitializing(false);
  }

  const signIn = () => {
    auth()
      .signInWithEmailAndPassword(
        'jane.doe@example.com',
        'SuperSecretPassword!',
      )
      .then(() => {
        console.log('User account created & signed in!');
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          console.log('That email address is already in use!');
        }

        if (error.code === 'auth/invalid-email') {
          console.log('That email address is invalid!');
        }

        console.error(error);
      });
  };

  const createUser = () => {
    auth()
      .createUserWithEmailAndPassword(
        'jane.doe@example.com',
        'SuperSecretPassword!',
      )
      .then(() => {
        console.log('User account created & signed in!');
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          console.log('That email address is already in use!');
        }

        if (error.code === 'auth/invalid-email') {
          console.log('That email address is invalid!');
        }

        console.error(error);
      });
  };

  async function onGoogleButtonPress() {
    // Get the users ID token
    const {idToken} = await GoogleSignin.signIn();

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Sign-in the user with the credential
    return auth().signInWithCredential(googleCredential);
  }

  const signOut = () => {
    auth()
      .signOut()
      .then(() => console.log('User signed out!'));
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;

  if (!loggedUser) {
    return (
      <View>
        <Text>Login</Text>
        <Button label="signup" onPress={createUser} />
        <Button label="login" onPress={signIn} />
        <Button
          label="Google Sign-In"
          onPress={() =>
            onGoogleButtonPress().then(() =>
              console.log('Signed in with Google!'),
            )
          }
        />
      </View>
    );
  }

  return (
    <View>
      <Text>Welcome {JSON.stringify(loggedUser)}</Text>
      <Button onPress={signOut} label="signout" />
    </View>
  );
}

// export function Login () {
//     return (
//         <View style={{ backgroundColor: Colors.screenBG, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//           <Text>Login!</Text>
//         </View>
//       );
// }
