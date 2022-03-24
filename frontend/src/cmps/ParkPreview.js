import React, {useState, useContext} from 'react';
import {View, Text, Image, Button} from 'react-native-ui-lib';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {Colors} from 'react-native-ui-lib';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export function ParkPreview({
  parkObj,
  navi,
  isLogged,
  onPanToMarker,
  onAddToFav,
  onRemoveFromFav,
}) {
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
  return (
    <View style={styles.parkPreviewCont}>
      <View style={styles.parkPreviewText}>
        <Text text30 color={Colors.moonOrSun}>
          {parkObj.name}
        </Text>
        <Text text70>
          {parkObj.address}, {parkObj.city}
        </Text>
      </View>
      <View style={styles.parkPreviewBtns}>
        <TouchableOpacity onPress={panToMarker}>
          <MaterialCommunityIcons
            style={{marginTop: 10, marginBottom: 10}}
            name={'google-maps'}
            size={30}
            color={Colors.mapMarker}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={!isLogged ? () => navi.jumpTo('התחברות') : toggleFav}
        >
          <MaterialCommunityIcons
            name={parkObj.isFavorite ? 'heart' : 'heart-outline'}
            size={30}
            color={isLogged ? 'tomato' : 'grey'}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  parkPreviewCont: {
    width: '100%',
    backgroundColor: 'black',
    height: 100,
    marginTop: 5,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  parkPreviewText: {alignItems: 'center'},
  parkPreviewBtns: {flexDirection: 'column'},
});
