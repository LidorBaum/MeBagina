import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Text, Colors} from 'react-native-ui-lib';
import firestore from '@react-native-firebase/firestore';

import {Chat, MessageType, defaultTheme} from '@flyerhq/react-native-chat-ui';
import {SafeAreaProvider} from 'react-native-safe-area-context';

export const ChatBox = props => {
  const {loggedUser} = useSelector(state => state.userReducer);
  console.log(props);
  const [msgs, setMsgs] = useState([]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection(props.parkId)
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        if (snapshot?.size) {
          let myDataArray = [];
          snapshot.forEach((doc, index) => {
            myDataArray.push({...doc.data()});
          });
          setMsgs(myDataArray);
          console.log('new msg');
        } else {
          console.log('its empty');
        }
      });
    return () => {
      console.log('unmounted');
      unsubscribe();
    };
  }, [firestore]);

  const uuidv4 = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.floor(Math.random() * 16);
      const v = c === 'x' ? r : (r % 4) + 8;
      return v.toString(16);
    });
  };

  const onSendMessage = async message => {
    firestore()
      .collection(props.parkId)
      .add(message)
      .then(() => {
        console.log('message added!');
      });
  };

  const addMessage = message => {
    setDummy([message, ...dummy]);
  };

  const handleSendPress = message => {
    console.log(loggedUser);
    const textMessage = {
      author: {id: loggedUser.firebaseUID, firstName: loggedUser.name},
      createdAt: Date.now(),
      id: uuidv4(),
      text: message.text,
      type: 'text',
    };
    onSendMessage(textMessage);
  };

  return (
    // <KeyboardAvoidingView
    // enabled={false}
    // >
    <SafeAreaProvider>
      <Chat
        locale="en"
        messages={msgs || []}
        onSendPress={handleSendPress}
        user={{id: loggedUser?.firebaseUID}}
        showUserNames={() => 'hello'}
        showUserAvatars={true}
        onEndReached={() => console.log('pressed')}
        onMessageLongPress={() => console.log('long press')}
        onTextFieldTap={() => console.log('avatar press')}
        theme={{
          ...defaultTheme,
          colors: {
            ...defaultTheme.colors,
            primary: Colors.navigatorBG,
            secondary: Colors.green80,
            inputBackground: Colors.cardBG,
            background: Colors.screenBG,
          },
        }}
      />
      {/* <BlurView
        style={styles.absolute}
        blurType="light"
        blurAmount={10}
        reducedTransparencyFallbackColor="white"
      /> */}
    </SafeAreaProvider>
    // </KeyboardAvoidingView>
  );
};
