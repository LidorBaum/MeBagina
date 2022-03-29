import React, {useState, useEffect, useRef} from 'react';
import GetLocation from 'react-native-get-location';
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import {Button,Colors, View} from 'react-native-ui-lib'; //eslint-disable-line
import MapView, {Callout, Marker} from 'react-native-maps';
import parkService from '../services/parkService';
import {ParkList} from '../cmps/ParkList';
import {useSelector, useDispatch} from 'react-redux';
import {newNotification} from '../redux/actions';
import {toastServerError} from '../services/utils';

const options = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false
  };

export const ParksHome = ({navigation}) => {
  const {loggedUser} = useSelector(state => state.userReducer);
  const dispatch = useDispatch();
  const markersRefArr = useRef([]);
  const mapRef = useRef(null);
  const [parks, setParks] = useState([]);
  const [center, setCenter] = useState({lat: 32.0153719, lng: 24.7457522});
  const getUserLocation = () => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    })
      .then(location => {
        mapRef.current.animateToRegion({
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        });
      })
      .catch(error => {
        const {code, message} = error;
        console.warn(code, message, 'problema');
      });
  };

  useEffect(() => {
    const getParks = async () => {
      const res = await parkService.getAllParks(loggedUser?._id);
      if (res.error) return notify(res.error.message, 'error');
      setParks([...res]);
      let parksLocs = [];
      res.map(park => {
        parksLocs.push({lat: park.coordinates.lat, lng: park.coordinates.lng});
      });
    };
    getParks();
  }, [loggedUser]);

  useEffect(() => {
    getUserLocation();
  }, []);

  const notify = (text, severity) => {
    dispatch(newNotification({toastText: text, toastSeverity: severity}));
  };

  const onPanToMarker = parkId => {
    const index = parks.findIndex(park => park._id === parkId);
    markersRefArr.current[index].showCallout();
    mapRef.current.animateToRegion({
      latitude: parseFloat(parks[index].coordinates.lat),
      longitude: parseFloat(parks[index].coordinates.lng),
      latitudeDelta: 0.015,
      longitudeDelta: 0.0121,
    });
  };

  const onAddToFav = async parkId => {
    ReactNativeHapticFeedback.trigger("impactLight", options);

    const res = await parkService.addFavorite(parkId, loggedUser._id);
    if (res.error) {
      return dispatch(
        newNotification({toastText: toastServerError, toastSeverity: 'error'}),
      );
    }
    const index = parks.findIndex(park => parkId === park._id);
    const parksClone = [...parks];
    const parkObj = parks[index];
    parkObj.isFavorite = true;
    parksClone.splice[(index, 1, parkObj)];
    setParks(parksClone);
    return true; //so the component Park will know that it has been executed succesfully
  };

  const onRemoveFromFav = async parkId => {
    ReactNativeHapticFeedback.trigger("notificationError", options);

    const res = await parkService.removeFavorite(parkId, loggedUser._id);
    if (res.error) {
      return dispatch(
        newNotification({toastText: toastServerError, toastSeverity: 'error'}),
      );
    }
    const index = parks.findIndex(park => parkId === park._id);
    const parksClone = [...parks];
    const parkObj = parks[index];
    parkObj.isFavorite = false;
    parksClone.splice[(index, 1, parkObj)];
    setParks(parksClone);
    return true; //so the component Park will know that it has been executed succesfully
  };

  const onParkPress = parkId => {
    const index = parks.findIndex(park => parkId === park._id);
    navigation.push('Park', {
      park: parks[index],
      onAddToFav: onAddToFav,
      onRemoveFromFav: onRemoveFromFav,
    });
  };

  const calloutPress = e => {
    onParkPress(e._dispatchInstances.memoizedProps.identifier);
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
      <MapView
        style={{width: '100%', height: '30%'}}
        customMapStyle={Colors.map}
        initialRegion={{
          latitude: center.lat,
          longitude: center.lng,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        }}
        ref={mapRef}
      >
        {parks.map((park, index) => {
          return (
            <Marker
              key={index}
              identifier={park._id}
              title={park.name}
              description={`${park.address}, ${park.city}`}
              ref={el => (markersRefArr.current[index] = el)}
              coordinate={{
                latitude: parseFloat(park.coordinates.lat),
                longitude: parseFloat(park.coordinates.lng),
              }}
              onCalloutPress={calloutPress}
            />
          );
        })}
      </MapView>
      <Button
        onPress={() => notify('אני בגינה', 'error')}
        label={'ףףףףףףףףףתלחץ עליי דחוף'}
        supportRTL
        style={{
          marginTop: 30,
          marginBottom: 20,
          backgroundColor: Colors.navigatorBG,
        }}
      ></Button>
      <ParkList
        parks={parks}
        navi={navigation}
        isLogged={Boolean(loggedUser)}
        onPanToMarker={onPanToMarker}
        onAddToFav={onAddToFav}
        onRemoveFromFav={onRemoveFromFav}
        onParkPress={onParkPress}
      />
    </View>
  );
};
