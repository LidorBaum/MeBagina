import React, {useEffect, useState} from 'react';
import {View, Text, Button, Incubator, Image} from 'react-native-ui-lib';
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
import {ScrollView} from 'react-native';
const {TextField} = Incubator;

export function Login({navigation}) {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  // const { loggedUser } = useSelector(state => state.userReducer);
  const dispatch = useDispatch();
  const [loginCred, setLoginCred] = useState({email: '', password: ''});
  const [signupCred, setSignupCred] = useState({
    email: '',
    name: '',
    password: '',
  });
  const [isNewUser, setIsNewUser] = useState(false);

  // Handle user state changes
  async function onAuthStateChanged(user) {
    const userFromDB = await userService.getByFirebaseUID(user?.uid);
    if (userFromDB.error) console.log('error fetching from db');
    // dispatch(setLoggedUser({ ...userFromDB, ...user }))
    dispatch(setLoggedUser(userFromDB));
    if (initializing) setInitializing(false);
  }

  async function handleUser(user) {
    if (user.additionalUserInfo.isNewUser) {
      console.log('new user detected');
      const userObj = {
        email: signupCred.email,
        name: signupCred.name,
        firebaseUID: user.user.uid,
      };
      const createdUserFromDB = await userService.createUser(userObj);
      if (createdUserFromDB.error) console.log('error fetching from db');
      dispatch(setLoggedUser(createdUserFromDB));
    } else {
      const userFromDB = await userService.getByFirebaseUID(user?.uid);
      if (userFromDB.error) console.log('error fetching from db');
      dispatch(setLoggedUser(userFromDB));
    }
    if (initializing) setInitializing(false);
  }
  const signInHardCode = () => {
    auth()
      .signInWithEmailAndPassword('Lidor@gmail.com', 'Lidor12346')
      .then(user => {
        handleUser(user);
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
  const signIn = () => {
    auth()
      .signInWithEmailAndPassword(loginCred.email, loginCred.password)
      .then(user => {
        handleUser(user);
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
      .createUserWithEmailAndPassword(signupCred.email, signupCred.password)
      .then(user => {
        handleUser(user);
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

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;

  const onChangeLogin = (field, value) => {
    setLoginCred(prevLogin => ({...prevLogin, [field]: value}));
  };

  const onChangeSignup = (field, value) => {
    setSignupCred(prevSignup => ({...prevSignup, [field]: value}));
  };

  const loginForm = (
    <View>
      <View
        keyboardShouldPersistTaps="handled"
        collum
        style={{
          width: 250,
          height: 400,
          justifyContent: 'space-between',
          alignContent: 'space-between',
        }}
      >
        <TextField
          text70
          color={Colors.moonOrSun}
          containerStyle={{marginBottom: 20}}
          floatingPlaceholder
          floatOnFocus
          floatingPlaceholderStyle={{color: Colors.blue70}}
          placeholder="אימייל"
          onChangeText={val => onChangeLogin('email', val)}
          style={{
            textAlign: 'left',
            borderBottomWidth: 2,
            borderBottomColor: loginCred.email
              ? Colors.moonOrSun
              : Colors.violet20,
          }}
        />
        <TextField
          text70
          color={Colors.moonOrSun}
          containerStyle={{marginBottom: 20}}
          floatingPlaceholder
          floatOnFocus
          placeholder="סיסמה"
          floatingPlaceholderStyle={{color: Colors.blue70}}
          placeholderTextColor={Colors.transparent}
          onChangeText={val => onChangeLogin('password', val)}
          style={{
            textAlign: 'left',
            borderBottomWidth: 2,
            borderBottomColor: loginCred.password
              ? Colors.moonOrSun
              : Colors.violet20,
          }}

          // floatOnFocus
        />
        <Button style={{marginBottom: 20}} label="התחבר" onPress={signIn} />
        <Button
          style={{marginBottom: 20}}
          label="התחבר הארד קוד"
          onPress={signInHardCode}
        />

        <Button
          label="Google Sign-In"
          onPress={() =>
            onGoogleButtonPress().then(() =>
              console.log('Signed in with Google!'),
            )
          }
        />
        <Button
          style={{marginTop: 20}}
          label="חדש כאן? צור משתמש"
          onPress={() => setIsNewUser(true)}
        />
      </View>
    </View>
  );

  const signupForm = (
    <View>
      <View
        keyboardShouldPersistTaps="never"
        collum
        style={{
          width: 250,
          height: 400,
          justifyContent: 'space-between',
          alignContent: 'space-between',
        }}
      >
        <TextField
          text70
          color={Colors.moonOrSun}
          containerStyle={{marginBottom: 20}}
          floatingPlaceholder
          floatOnFocus
          placeholder="שם"
          onChangeText={val => onChangeSignup('name', val)}
          floatingPlaceholderStyle={{color: Colors.blue70}}
          placeholderTextColor={Colors.transparent}
          style={{
            textAlign: 'left',
            borderBottomWidth: 2,
            borderBottomColor: signupCred.name
              ? Colors.moonOrSun
              : Colors.violet20,
          }}
        />
        <TextField
          text70
          color={Colors.moonOrSun}
          containerStyle={{marginBottom: 20}}
          floatingPlaceholder
          floatOnFocus
          placeholder="אימייל"
          onChangeText={val => onChangeSignup('email', val)}
          floatingPlaceholderStyle={{color: Colors.blue70}}
          placeholderTextColor={Colors.transparent}
          style={{
            textAlign: 'left',
            borderBottomWidth: 2,
            borderBottomColor: signupCred.email
              ? Colors.moonOrSun
              : Colors.violet20,
          }}
        />
        <TextField
          text70
          color={Colors.moonOrSun}
          containerStyle={{marginBottom: 20}}
          floatingPlaceholder
          floatOnFocus
          placeholder="סיסמה"
          placeholderTextColor={Colors.moonOrSun}
          onChangeText={val => onChangeSignup('password', val)}
          floatingPlaceholderStyle={{color: Colors.blue70}}
          placeholderTextColor={Colors.transparent}
          style={{
            textAlign: 'left',
            borderBottomWidth: 2,
            borderBottomColor: signupCred.password
              ? Colors.moonOrSun
              : Colors.violet20,
          }}
        />
        <Button style={{marginBottom: 20}} label="הירשם" onPress={createUser} />

        <Button
          label="Google Sign-In"
          onPress={() =>
            onGoogleButtonPress().then(() =>
              console.log('Signed in with Google!'),
            )
          }
        />
        <Button
          style={{marginTop: 20}}
          label="נרשמת כבר? התחבר"
          onPress={() => setIsNewUser(false)}
        />
      </View>
    </View>
  );

  return (
    <View
      style={{
        marginTop: 100,
        alignItems: 'center',
        justifyContent: 'center',
        height: '50%',
      }}
    >
      {/* <View style={{}}> */}
      <Image
        source={require('../assets/logo.png')}
        style={{width: 150, height: 150}}
        resizeMode="cover"
      />
      {/* </View> */}
      {isNewUser ? signupForm : loginForm}
    </View>
  );
}
