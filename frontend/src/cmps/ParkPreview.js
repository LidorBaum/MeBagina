import React from 'react';
import {View, Text, Colors} from 'react-native-ui-lib';
import {StyleSheet, TouchableOpacity} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import IconBadge from 'react-native-icon-badge';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

export function ParkPreview({
  parkObj,
  navi,
  isLogged,
  onPanToMarker,
  onAddToFav,
  onRemoveFromFav,
  onParkPress,
  onDogPress,
}) {
  const distance = {
    pre: 'כ- ',
  };
  if (parkObj?.distance) {
    if (parkObj.distance < 1) {
      (distance.num = parseInt(parkObj.distance * 1000)),
        (distance.text = ' מטר ממך');
    } else {
      (distance.num = parseFloat(parkObj.distance.toFixed(2))),
        (distance.text = ' ק"מ ממך');
    }
  }

  parseInt(parkObj.distance * 1000);
  const panToMarker = () => {
    onPanToMarker(parkObj._id);
  };

  const toggleFav = () => {
    if (parkObj.isFavorite) removeFromFav();
    else addToFav();
  };

  const addToFav = () => {
    onAddToFav(parkObj._id);
  };
  const removeFromFav = () => {
    onRemoveFromFav(parkObj._id);
  };
  const parkPress = () => {
    onParkPress(parkObj._id);
  };
  const dogPress = () => {
    onDogPress(parkObj._id);
  };
  return (
    <TouchableOpacity onPress={parkPress}>
      <View style={styles.parkPreviewCont}>
        <View style={styles.parkPreviewText}>
          <Text text30 color={Colors.textColor}>
            {parkObj.name}
          </Text>
          <Text text70 color={Colors.textColor}>
            {parkObj.address}, {parkObj.city}
          </Text>
          {parkObj.distance && (
            <Text text80 color={Colors.textColor}>
              {distance.pre}
              {distance.num} {distance.text}
            </Text>
          )}
        </View>
        <View style={styles.parkPreviewBtns}>
          <TouchableOpacity
            onPress={dogPress}
            style={{
              marginRight: 10,
            }}
          >
            <View style={styles.parkPreviewButton}>
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
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={panToMarker}>
            <View style={styles.parkPreviewButton}>
              <MaterialCommunityIcons
                style={{marginTop: 10, marginBottom: 10}}
                name={'google-maps'}
                size={40}
                color={Colors.mapMarker}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={!isLogged ? () => navi.jumpTo('התחברות') : toggleFav}
            style={{marginLeft: 10}}
          >
            <View style={styles.parkPreviewButton}>
              <MaterialCommunityIcons
                name={parkObj.isFavorite ? 'heart' : 'heart-outline'}
                size={45}
                color={isLogged ? 'tomato' : 'grey'}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  parkPreviewCont: {
    width: '100%',
    backgroundColor: Colors.cardBG,
    height: 100,
    marginTop: 5,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  parkPreviewText: {alignItems: 'center', color: Colors.grey60},
  parkPreviewButton: {padding: 10},
  parkPreviewBtns: {flexDirection: 'row', alignItems: 'center'},
});
