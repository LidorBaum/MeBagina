import React, {useState} from 'react';
import {
  Image,
  Colors,
  View,
  Text,
  Dialog,
  PanningProvider,
  Button,
  AnimatedImage,
} from 'react-native-ui-lib';
import {
  TouchableOpacity,
  Platform,
  Linking,
  ActivityIndicator,
  TouchableHighlight,
  ImageBackground,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import IconBadge from 'react-native-icon-badge';
import {ChatBox} from './ChatBox';
import {LogBox} from 'react-native';
import {useDispatch} from 'react-redux';
import {newNotification} from '../../../redux/actions';

import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};
export const Park = ({route}) => {
  LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
  ]);
  const {park, onAddToFav, onRemoveFromFav} = route.params;
  const dispatch = useDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [parkObj, setParkObj] = useState(park);
  const [isJoinedChat, setIsJoinedChat] = useState(false);
  const [imageResizeMode, setImageResizeMode] = useState('cover');
  const toggleFav = () => {
    let result;
    if (parkObj.isFavorite) result = removeFromFav(parkObj._id);
    else result = addToFav(parkObj._id);
    if (result) {
      setParkObj(prevPark => ({...prevPark, isFavorite: !prevPark.isFavorite}));
    }
  };
  const addToFav = () => {
    return onAddToFav(parkObj._id);
  };
  const removeFromFav = () => {
    return onRemoveFromFav(parkObj._id);
  };

  navigateToPark = () => {
    const scheme = Platform.select({ios: 'maps:0,0?q=', android: 'geo:0,0?q='});
    const latLng = `${parkObj.coordinates.lat},${parkObj.coordinates.lng}`;
    const label = `${parkObj.address} ${parkObj.city}`;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });
    Linking.openURL(url);
  };
  const notify = (text, severity) => {
    dispatch(newNotification({toastText: text, toastSeverity: severity}));
  };

  const onOpenReportMuniModal = () => {
    ReactNativeHapticFeedback.trigger('soft', options);
    setIsModalVisible(true);
  };

  const onReportMuni = () => {
    const string = '??????, ?????? ???????? ?????????? XXX ?????? ??????...';
    const uri = `https://wa.me/972544810000?text=${string}`;
    Linking.openURL(uri);
  };
  return (
    <>
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-start',
          alignItems: 'center',
          padding: 5,
          backgroundColor: Colors.screenBG,
        }}
      >
        <Image
          source={{
            uri: parkObj.image,
          }}
          errorSource={require('../../../assets/logo.png')}
          backgroundColor={Colors.screenBG}
          style={{width: '100%', height: 200}}
          resizeMode={imageResizeMode}
          onError={() => {
            setImageResizeMode('contain');
            notify(
              '?????????? ???? ???????????? ?????????? ???? ??????????, ???????? ?????????? ?????????????',
              'warn',
            );
          }}
        />
        <View
          style={{
            height: 100,
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 10,
          }}
        >
          <View
            style={{
              width: '40%',
            }}
          >
            <Text
              text40
              style={{
                color: Colors.textColor,
              }}
            >
              {parkObj.name}
            </Text>
            <Text
              text50
              style={{
                color: Colors.textColor,
              }}
            >
              {parkObj.address}, {parkObj.city}
            </Text>
          </View>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row-reverse',
            }}
          >
            <TouchableOpacity onPress={toggleFav}>
              <MaterialCommunityIcons
                name={parkObj.isFavorite ? 'heart' : 'heart-outline'}
                size={45}
                color={'tomato'}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                marginRight: 10,
              }}
            >
              <IconBadge
                MainElement={
                  <FontAwesome5 name={'dog'} size={35} color={'#ffe261'} />
                }
                BadgeElement={
                  <Text style={{color: '#000000'}}>{parkObj.dogs}</Text>
                }
                IconBadgeStyle={{
                  position: 'absolute',
                  top: -15,
                  right: 35,
                  width: 20,
                  height: 20,
                  borderRadius: 15,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#ffe261',
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={navigateToPark}
              style={{
                marginRight: 15,
              }}
            >
              <MaterialCommunityIcons
                name={'navigation-variant'}
                size={45}
                color={Colors.navigatorBG}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onOpenReportMuniModal}
              style={{
                marginRight: 15,
              }}
            >
              <MaterialIcons
                name={'report'}
                size={45}
                color={Colors.navigatorBG}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            width: '100%',
            height: '60%',
            borderRadius: 20,
            marginBottom: 80,
          }}
        >
          <View
            style={{
              width: '100%',
              height: '100%',
              borderTopWidth: 4,
              borderBottomWidth: 5,
              borderRadius: 5,
            }}
          >
            {isJoinedChat ? (
              <ChatBox parkId={parkObj._id} />
            ) : (
              <ImageBackground
                source={{
                  uri: 'https://res.cloudinary.com/echoshare/image/upload/v1649026203/MeBagina/Untitled-2_vb6zb6.png',
                }}
                errorSource={require('../../../assets/logo.png')}
                backgroundColor={Colors.screenBG}
                style={{
                  width: '100%',
                  height: '100%',
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                resizeMode={imageResizeMode}
                blurRadius={10}
                onError={() => {
                  setImageResizeMode('contain');
                  notify(
                    '?????????? ???? ???????????? ?????????? ???? ??????????, ???????? ?????????? ?????????????',
                    'warn',
                  );
                }}
              >
                <Button
                  text80
                  label="?????????? ???? ???????????? ????'????, ?????? ???????? ?????????????"
                  style={{linkColor: Colors.red20, width: 350, height: 50}}
                  onPress={() => setIsJoinedChat(true)}
                />
              </ImageBackground>
            )}
          </View>
        </View>
      </View>
      <Dialog
        useSafeArea
        visible={isModalVisible}
        panDirection={PanningProvider.Directions.LEFT}
        key={'123'}
        onDismiss={() => setIsModalVisible(false)}
      >
        <View
          flex={1}
          style={{
            backgroundColor: 'white',
            borderRadius: 10,
          }}
        >
          <View marginT-20 marginH-20>
            <Text black text50>
              ???? ???????? ???????????
            </Text>
            <Text black marginT-20 text70>
              ???????? ?????????? ?????????? ?????????????? ????????????????
            </Text>
          </View>
          <View
            margin-20
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <Button
              text60
              label="???? ??????????"
              link
              style={{linkColor: Colors.red20}}
              onPress={() => setIsModalVisible(false)}
            />
            <Button text60 label="???? ???????? ??????" link onPress={onReportMuni} />
          </View>
        </View>
      </Dialog>
    </>
  );
};
