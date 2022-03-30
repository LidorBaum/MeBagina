import React, {useEffect, useState} from 'react';
import {View, Button, Incubator, Image, Colors} from 'react-native-ui-lib';
import {Dimensions} from 'react-native';
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
import {useDispatch} from 'react-redux';
import {setLoggedUser} from '../redux/actions';
import userService from '../services/userService';
import Svg, {Path} from 'react-native-svg';
const {TextField} = Incubator;

export function Login({navigation}) {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
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
    dispatch(setLoggedUser(userFromDB));
    if (initializing) setInitializing(false);
  }

  async function handleUser(user) {
    if (user.additionalUserInfo.isNewUser) {
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
      <Svg
        height={200}
        width={Dimensions.get('screen').width}
        viewBox="0 0 1440 320"
      >
        <Path
          fill={Colors.moonOrSun}
          d="M0,224L48,186.7C96,149,192,75,288,58.7C384,43,480,85,576,138.7C672,192,768,256,864,245.3C960,235,1056,149,1152,117.3C1248,85,1344,107,1392,117.3L1440,128L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
        />
      </Svg>
      <Image
        source={require('../assets/logo.png')}
        style={{width: 150, height: 150}}
        resizeMode="cover"
      />
      {isNewUser ? signupForm : loginForm}
    </View>
  );
}
