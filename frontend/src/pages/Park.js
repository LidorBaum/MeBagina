import React, {useState} from 'react';
import {Image, Colors, View, Text} from 'react-native-ui-lib';
import {TouchableOpacity} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import IconBadge from 'react-native-icon-badge';

export const Park = ({route, navigation}) => {
  const {park, onAddToFav, onRemoveFromFav} = route.params;

  const [parkObj, setParkObj] = useState(park);

  const toggleFav = () => {
    let result;
    if (parkObj.isFavorite) result = removeFromFav(parkObj._id);
    else result = addToFav(parkObj._id);
    if (result) {
      console.log('succedded');
      setParkObj(prevPark => ({...prevPark, isFavorite: !prevPark.isFavorite}));
    }
  };
  const addToFav = () => {
    return onAddToFav(parkObj._id);
  };
  const removeFromFav = () => {
    return onRemoveFromFav(parkObj._id);
  };

  return (
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
        errorSource={require('../assets/logo.png')}
        backgroundColor={Colors.screenBG}
        style={{width: '100%', height: 200}}
        resizeMode="cover"
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
            width: '50%',
          }}
        >
          <Text
            style={{
              fontSize: 40,
              color: Colors.textColor,
            }}
          >
            {parkObj.name}
          </Text>
          <Text
            style={{
              fontSize: 25,
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
        </View>
      </View>
      <View
        style={{
          backgroundColor: '#489EFE',
          width: '100%',
          height: '50%',
          margin: 6,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 20,
        }}
      >
        <Text>CHAT</Text>
      </View>
    </View>
  );
};