import React from 'react';
import {View, Text} from 'react-native-ui-lib';
import {ScrollView} from 'react-native';
import {ParkPreview} from './ParkPreview';

export const ParkList = ({parks, navi, isLogged, onPanToMarker, onAddToFav, onRemoveFromFav}) => {
  return (
    <ScrollView style={{width: '100%', marginTop: 10}}>
      {parks.map(park => (
        <ParkPreview key={park._id} parkObj={park} navi={navi} isLogged={isLogged} onPanToMarker={onPanToMarker} onAddToFav={onAddToFav} onRemoveFromFav={onRemoveFromFav} />
      ))}
    </ScrollView>
  );
};
