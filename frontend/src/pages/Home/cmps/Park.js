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
    const string = 'היי, אני נמצא בגינת XXX ויש כאן...';
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
              'עדיין לא הוסיפו תמונה של הגינה, רוצה להיות הראשון?',
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
            height: '50%',
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
            <ChatBox parkId={parkObj._id} />
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
              יש בעיה בגינה?
            </Text>
            <Text black marginT-20 text70>
              אפשר לדווח למוקד העירייה בוואטסאפ
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
              label="לא עכשיו"
              link
              style={{linkColor: Colors.red20}}
              onPress={() => setIsModalVisible(false)}
            />
            <Button text60 label="קח אותי לשם" link onPress={onReportMuni} />
          </View>
        </View>
      </Dialog>
    </>
  );
};
