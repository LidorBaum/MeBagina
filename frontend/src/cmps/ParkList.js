import React, {useState, useCallback} from 'react';
import {View, Text, Colors} from 'react-native-ui-lib';
import {ScrollView, RefreshControl, FlatList} from 'react-native';
import {ParkPreview} from './ParkPreview';

export const ParkList = ({
  parks,
  navi,
  isLogged,
  onPanToMarker,
  onAddToFav,
  onRemoveFromFav,
  onParkPress,
}) => {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);

  const renderPark = park => {
    return (
      <ParkPreview
        key={park._id}
        parkObj={park.item}
        navi={navi}
        isLogged={isLogged}
        onPanToMarker={onPanToMarker}
        onAddToFav={onAddToFav}
        onRemoveFromFav={onRemoveFromFav}
        onParkPress={onParkPress}
      />
    );
  };

  return (
    <ScrollView
      style={{width: '100%', marginTop: 10}}
      RefreshControl={
        <RefreshControl
          refreshing={refreshing}
          enabled={true}
          onRefresh={onRefresh}
        />
      }
    >
      <FlatList
        data={parks}
        renderItem={renderPark}
        keyExtractor={item => item._id}
      />
      {/* {parks.map(park => (
        <ParkPreview
          key={park._id}
          parkObj={park}
          navi={navi}
          isLogged={isLogged}
          onPanToMarker={onPanToMarker}
          onAddToFav={onAddToFav}
          onRemoveFromFav={onRemoveFromFav}
          onParkPress={onParkPress}
        />
      ))} */}
    </ScrollView>
  );
};
