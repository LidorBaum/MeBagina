import React, {useEffect, useState, useRef} from 'react';
import {StyleSheet, Animated} from 'react-native';
import {
  View,
  Text,
  Button,
  Colors,
  Icon,
  Dialog,
  PanningProvider,
  Incubator,
} from 'react-native-ui-lib';
import {useSelector, useDispatch} from 'react-redux';
import {setLoggedUser} from '../redux/actions';
import auth from '@react-native-firebase/auth';
import userService from '../services/userService';
import {newNotification} from '../redux/actions';

const {TextField} = Incubator;
export function Profile({navigation}) {
  const [isEditDetailsDialog, setIsEditDetailsDialog] = useState(false);
  const [greet, setGreet] = useState('שלום, ');
  const [editDetailsForm, setForm] = useState({
    name: '',
    email: '',
  });
  const [userPassForEdit, setUserPassForEdit] = useState('');
  const [isSaveable, setIsSaveable] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);

  useEffect(() => {
    if (!loggedUser) return;
    resetEditDetailsForm();
  }, [loggedUser]);

  useEffect(() => {
    let date = new Date();
    let hours = date.getHours();
    // let hours = 1
    console.log(typeof hours, hours);
    switch (true) {
      case hours >= 6 && hours <= 10:
        setGreet('בוקר טוב, ');
        break;
      case hours >= 11 && hours <= 18:
        setGreet('צהריים טובים, ');
        break;
      case hours >= 19 && hours <= 21:
        setGreet('ערב טוב, ');
        break;
      default:
        console.log('im in default');
        setGreet('לילה טוב, ');
        break;
    }
  }, []);

  const handleChangeDetails = (field, value) => {
    if (field === 'email' && loggedUser.email !== value) {
      console.log('meets');
      setIsEditingEmail(true);
    } else if (field === 'email' && loggedUser.email === value)
      setIsEditingEmail(false);
    const newForm = {...editDetailsForm, [field]: value};
    setIsSaveable(checkSavability(newForm));
    setForm(newForm);
  };

  const checkSavability = CredsToCheck => {
    if (
      CredsToCheck.email === loggedUser.email &&
      CredsToCheck.name === loggedUser.name
    )
      return false;
    if (!CredsToCheck.email || !CredsToCheck.name) return false;
    return true;
  };

  const cancelEditDetails = () => {
    setIsEditDetailsDialog(false);
    setIsEditingEmail(false);
    resetEditDetailsForm();
  };

  const resetEditDetailsForm = () => {
    console.log('resetting');
    setForm({
      name: loggedUser.name,
      email: loggedUser.email,
    });
  };
  const notify = (text, severity) => {
    dispatch(newNotification({toastText: text, toastSeverity: severity}));
  };

  const onSaveNewDetails = async () => {
    // const user = await auth().user
    // console.log(user);
    // const res = await user.updateEmail('Lidor4400')
    // // console.log(Object.keys(user._nativeModule));
    // // console.log(user._nativeModule, 'native moduel');
    // const res = await user._nativeModule.reauthenticateWithCredential(loggedUser.email, userPassForEdit)
    // console.log(res);
    // console.log(res);

    if (editDetailsForm.email !== loggedUser.email)
      console.log('email changed'); //Need to change both firebase and mongo
    else {
      //Need to update only the name in mongo
      const updatedUser = await userService.updateUser({
        _id: loggedUser._id,
        ...editDetailsForm,
      });
      if (updatedUser.error) return notify(updatedUser.error.message, 'error');
      console.log(updatedUser);
      dispatch(setLoggedUser(updatedUser));
      setIsEditDetailsDialog(false);
      notify('נשמר בהצלחה!', 'success');
    }
    // try{
    //     console.log('updating emeail');

    // const res = await auth().user.updateEmail('Lidor1@gmail.com')
    // console.log(res);
    // } catch(err){
    //     console.log(err);
    // }
  };

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
    <>
      <View
        style={{
          marginTop: 30,
        }}
      >
        <View center style={styles.welcomeView}>
          <Text style={styles.textStyle} text40>
            {greet}
            {loggedUser.name}
          </Text>
          <Text style={styles.textStyle} text60>
            {loggedUser.email}
          </Text>
          <Text style={styles.textStyle} text50>
            מה בא לך לעשות?
          </Text>
        </View>
        <View center style={styles.actionsBtns}>
          <Button
            label={'עדכן פרטים'}
            onPress={() => setIsEditDetailsDialog(true)}
            style={{
              backgroundColor: Colors.navigatorBG,
            }}
            outlineColor={Colors.cardBG}
            outlineWidth={2}
          />
          <Button
            label={'הכלבים שלי'}
            style={{
              backgroundColor: Colors.navigatorBG,
            }}
            outlineColor={Colors.cardBG}
            outlineWidth={2}
          />
          <Button
            label={'דיווח על בעיה'}
            style={{
              backgroundColor: Colors.navigatorBG,
            }}
            outlineColor={Colors.cardBG}
            outlineWidth={2}
            // iconSource={require('../assets/myloc.png')}
            // iconOnRight
            // iconStyle={{
            //     width: 30,
            //     height: 30
            // }}
          />
        </View>
        <View center>
          <Button
            label="התנתק"
            style={{
              backgroundColor: Colors.navigatorBG,
              width: 150,
              marginTop: 100,
            }}
            onPress={signOut}
            outlineColor={Colors.cardBG}
            outlineWidth={2}
          />
        </View>
      </View>
      <Dialog
        useSafeArea
        key={'123'}
        visible={isEditDetailsDialog}
        onDismiss={cancelEditDetails}
        panDirection={PanningProvider.Directions.DOWN}
      >
        <View flex={1} style={styles.editDetailsModalContainer}>
          <View marginT-20 marginH-20>
            <Text black text50>
              {editDetailsForm.name}
            </Text>
            <TextField
              text60
              value={editDetailsForm.name}
              color={Colors.moonOrSun}
              containerStyle={{marginBottom: 20}}
              floatingPlaceholder
              floatOnFocus
              placeholder="שם"
              onChangeText={val => handleChangeDetails('name', val)}
              floatingPlaceholderStyle={{
                color: editDetailsForm.name ? Colors.moonOrSun : Colors.red30,
              }}
              placeholderTextColor={Colors.transparent}
              style={{
                borderBottomWidth: 2,
                borderBottomColor: editDetailsForm.name
                  ? Colors.moonOrSun
                  : Colors.red30,
              }}
            />
            <TextField
              text60
              value={editDetailsForm.email}
              color={Colors.moonOrSun}
              containerStyle={{marginBottom: 20}}
              floatingPlaceholder
              floatOnFocus
              placeholder="אימייל"
              onChangeText={val => handleChangeDetails('email', val)}
              floatingPlaceholderStyle={{
                color: editDetailsForm.email ? Colors.moonOrSun : Colors.red30,
              }}
              placeholderTextColor={Colors.transparent}
              style={{
                textAlign: 'left',
                borderBottomWidth: 2,
                borderBottomColor: editDetailsForm.email
                  ? Colors.moonOrSun
                  : Colors.red30,
              }}
            />
            {isEditingEmail && (
              <TextField
                text60
                value={userPassForEdit}
                color={Colors.moonOrSun}
                containerStyle={{marginBottom: 20}}
                floatingPlaceholder
                floatOnFocus
                placeholder="סיסמה"
                onChangeText={val => setUserPassForEdit(val)}
                floatingPlaceholderStyle={{
                  color: userPassForEdit ? Colors.moonOrSun : Colors.red30,
                }}
                placeholderTextColor={Colors.transparent}
                style={{
                  textAlign: 'left',
                  borderBottomWidth: 2,
                  borderBottomColor: userPassForEdit
                    ? Colors.moonOrSun
                    : Colors.red30,
                }}
              />
            )}
            <View margin-20 style={styles.editDetailsModalBtnsView}>
              <Button
                text70
                label="התחרטתי, תבטל"
                link
                linkColor={Colors.red40}
                onPress={cancelEditDetails}
              />
              <Button
                text60
                label="שמור"
                link
                linkColor={Colors.navigatorBG}
                onPress={onSaveNewDetails}
                disabled={!isSaveable}
              />
            </View>
          </View>
        </View>
      </Dialog>
    </>
  );
}

const styles = StyleSheet.create({
  actionsBtns: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  editDetailsModalContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
  },
  editDetailsModalBtnsView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  welcomeView: {
    margin: 20,
  },
  textStyle: {
    margin: 5,
  },
});
