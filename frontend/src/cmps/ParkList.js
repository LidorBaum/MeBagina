import React from 'react';
import {View, Text} from 'react-native-ui-lib';
import {ScrollView} from 'react-native';
import {ParkPreview} from './ParkPreview';

export const ParkList = ({parks}) => {
  return (
    <ScrollView style={{width: '100%', marginTop: 10}}>
      {parks.map(park => (
        <ParkPreview key={park.name} parkObj={park} />
      ))}
    </ScrollView>
  );
};
