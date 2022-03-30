import React, {useState, useCallback} from 'react';
import {ScrollView, RefreshControl} from 'react-native';
import {ParkPreview} from './ParkPreview';

export const ParkList = ({
  parks,
  navi,
  isLogged,
  onPanToMarker,
  onAddToFav,
  onRemoveFromFav,
  onParkPress,
  onDogPress,
}) => {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);

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
      {parks.map(park => (
        <ParkPreview
          key={park._id}
          parkObj={park}
          navi={navi}
          isLogged={isLogged}
          onPanToMarker={onPanToMarker}
          onAddToFav={onAddToFav}
          onRemoveFromFav={onRemoveFromFav}
          onParkPress={onParkPress}
          onDogPress={onDogPress}
        />
      ))}
    </ScrollView>
  );
};
