import React, {useState, useContext} from 'react';
import {View, Text, Image, Button} from 'react-native-ui-lib';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {Colors} from 'react-native-ui-lib';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export function ParkPreview({parkObj}) {
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
        <TouchableOpacity onPress={() => console.log('pressed', parkObj._id)}>
          <MaterialCommunityIcons
            style={{marginTop: 10, marginBottom: 10}}
            name={'google-maps'}
            size={30}
            color={Colors.mapMarker}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => console.log('pressed', parkObj._id)}>
          <MaterialCommunityIcons
            name={'heart-outline'}
            size={30}
            color={'tomato'}
          />
        </TouchableOpacity>
      </View>
      {/* <View>
                <Image source={{ uri: parkObj.image }}
                    resizeMode='cover'
                    style={{
                        width: 120,
                        height: 120,
                        borderRadius: 10,
                    }}
                    errorSource={require('../../assets/marker.png')} />
            </View> */}
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
