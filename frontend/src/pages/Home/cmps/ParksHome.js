import React, {useState, useEffect, useRef} from 'react';
import GetLocation from 'react-native-get-location';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {
  Button,
  Colors,
  View,
  Dialog,
  PanningProvider,
  Text,
  Checkbox,
} from 'react-native-ui-lib'; //eslint-disable-line
import MapView, {Callout, Marker} from 'react-native-maps';
import parkService from '../../../services/parkService';
import {ParkList} from '../../../cmps/ParkList';
import {useSelector, useDispatch} from 'react-redux';
import {newNotification} from '../../../redux/actions';
import {toastServerError} from '../../../services/utils';
import {calcDistance} from '../../../services/utils';
import {TouchableHighlight, TouchableOpacity} from 'react-native';
const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

export const ParksHome = ({navigation}) => {
  const {loggedUser} = useSelector(state => state.userReducer);
  console.log(loggedUser);
  const dispatch = useDispatch();
  const markersRefArr = useRef([]);
  const mapRef = useRef(null);
  const [parks, setParks] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [filters, setFilters] = useState({
    vets: true,
    parks: true,
  });
  const [markersForDisplay, setMarkersForDisplay] = useState([]);
  const [center, setCenter] = useState({lat: 32.0153719, lng: 24.7457522});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const getUserLocation = () => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    })
      .then(async location => {
        mapRef.current.animateToRegion({
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        });
        setCenter({lat: location.latitude, lng: location.longitude});
        const nearVetsRes = await fetch(
          `https://maps.googleapis.com/maps/api/place/search/json?location=${location.latitude},${location.longitude}&radius=2000&types=veterinary_care&sensor=false&key=AIzaSyA0PnKw6ClT_i8_c4ePtiXRLg7MjyC4VCA&language=he-il`,
          {method: 'GET'},
        );
        const nearVetsObj = await nearVetsRes.json();
        let nearVetsGeos = [];
        nearVetsObj.results.forEach((vet, idx) => {
          const addressArr = vet.vicinity.split(',');
          nearVetsGeos.push({
            _id: (idx * 100 + 100).toString(),
            coordinates: {
              lat: vet.geometry.location.lat,
              lng: vet.geometry.location.lng,
            },
            type: 'vet',
            name: vet.name,
            address: addressArr[0],
            city: addressArr[1],
          });
        });
        setMarkers(prevMarkers => [
          ...prevMarkers,
          ...nearVetsGeos,
          {
            _id: 'userLoc',
            name: 'אני',
            type: 'userLoc',
            coordinates: {
              lat: location.latitude,
              lng: location.longitude,
            },
          },
        ]);
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
      res.forEach(park => (park.type = 'park'));
      setMarkers(prevMarkers => [...prevMarkers, ...res]);
    };
    getParks();
    getUserLocation();
  }, []);

  useEffect(() => {
    const getParks = async () => {
      const res = await parkService.getAllParks(loggedUser?._id);
      if (res.error) return notify(res.error.message, 'error');
      setParks([...res]);
      res.forEach(park => (park.type = 'park'));
      // setMarkers(prevMarkers => [...prevMarkers, ...res]);
      return res;
    };
    const parks = getParks();
    if (!parks.length) return;
    const parksArr = [...parks];
    parksArr.forEach(park => {
      const dist = calcDistance(
        park.coordinates.lat,
        park.coordinates.lng,
        center.lat,
        center.lng,
      );
      park.distance = dist;
    });
    parksArr.sort((a, b) => {
      if (a.distance < b.distance) return -1;
      if (a.distance > b.distance) return 1;
      return 0;
    });
    setParks(parksArr);
    const markersArr = [...markers];
    markersArr.splice(0, parksArr.length - 1, parksArr);
    setMarkers(...markersArr);
  }, [center]);

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
    ReactNativeHapticFeedback.trigger('impactLight', options);

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
    ReactNativeHapticFeedback.trigger('notificationError', options);

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

  const onDogPress = parkId => {
    setIsModalVisible(true);
  };

  const onChangeMapMarkers = e => {
    console.log('processing changes');
    const markersArr = [...markers];
    setMarkers(markersArr.filter(marker => marker.type !== 'park'));
  };

  return (
    <>
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-start',
          alignItems: 'center',
          padding: 5,
          // height: '80%',
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
          {markers.map((marker, index) => {
            return (
              <Marker
                key={index}
                icon={
                  marker.type === 'userLoc'
                    ? require('../../../assets/myloc.png')
                    : marker.type === 'vet'
                    ? require('../../../assets/pawmarker.png')
                    : undefined
                }
                // pinColor={marker.type === 'userLoc' ? 'blue' : 'red'}
                identifier={marker._id}
                // title={marker.name}
                // description={
                //   marker.type !== 'userLoc'
                //     ? `${marker.address}, ${marker.city}`
                //     : undefined
                // }
                ref={el => (markersRefArr.current[index] = el)}
                coordinate={{
                  latitude: parseFloat(marker.coordinates.lat),
                  longitude: parseFloat(marker.coordinates.lng),
                }}
                onCalloutPress={!marker.type ? calloutPress : () => {}}
              >
                <Callout>
                  <Text
                    text70
                    center
                    style={{color: 'black', paddingLeft: 5, paddingRight: 5}}
                  >
                    {marker.name}
                  </Text>
                  {marker.type !== 'userLoc' && (
                    <Text text70 center style={{color: Colors.navigatorBG}}>
                      {marker.address}, {marker.city}
                    </Text>
                  )}
                </Callout>
              </Marker>
            );
          })}
        </MapView>
        <View
          row
          padding={10}
          style={{
            justifyContent: 'space-evenly',
            width: '100%',
          }}
        >
          <Checkbox
            style={{
              margin: 10,
              backgroundColor: filters.vets
                ? Colors.navigatorBG
                : Colors.screenBG,
              width: 35,
              height: 35,
            }}
            color={Colors.navigatorBG}
            label={'מרפאות'}
            labelStyle={{
              color: Colors.navigatorBG,
              marginLeft: -5,
              fontSize: 16,
            }}
            value={filters.vets}
            onValueChange={e =>
              setFilters(prevFilters => ({...prevFilters, vets: e}))
            }
            // outline
            // size={60}
          />
          <Checkbox
            style={{
              margin: 10,
              backgroundColor: filters.parks
                ? Colors.navigatorBG
                : Colors.screenBG,
              width: 35,
              height: 35,
            }}
            color={Colors.navigatorBG}
            label={'גינות'}
            labelStyle={{
              color: Colors.navigatorBG,
              marginLeft: -5,
              fontSize: 16,
            }}
            value={filters.parks}
            onValueChange={e =>
              setFilters(prevFilters => ({...prevFilters, parks: e}))
            }
          />
          {/* <Checkbox
            style={{ margin: 10, backgroundColor: Colors.green10 }}
            color={Colors.navigatorBG}
            label={'חתולים'}
            labelStyle={{ color: Colors.navigatorBG, marginLeft: -5,  fontSize: 16}}
            value={true}
            onValueChange={e => console.log('value changed', e)}
          /> */}
        </View>
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
          onDogPress={onDogPress}
        />
      </View>
      <Dialog
        useSafeArea
        visible={isModalVisible}
        panDirection={PanningProvider.Directions.DOWN}
        // top={true}
        // bottom={true}
        // key={'123'}
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
              מי בגינה?
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                flexWrap: 'wrap',
              }}
            >
              <View
                style={{
                  width: 50,
                  height: 50,
                  backgroundColor: Colors.violet50,
                  margin: 10,
                }}
              />
              <View
                style={{
                  width: 50,
                  height: 50,
                  backgroundColor: Colors.violet50,
                  margin: 10,
                }}
              />
              <View
                style={{
                  width: 50,
                  height: 50,
                  backgroundColor: Colors.violet50,
                  margin: 10,
                }}
              />
              <View
                style={{
                  width: 50,
                  height: 50,
                  backgroundColor: Colors.violet50,
                  margin: 10,
                }}
              />
              <View
                style={{
                  width: 50,
                  height: 50,
                  backgroundColor: Colors.violet50,
                  margin: 10,
                }}
              />
              <View
                style={{
                  width: 50,
                  height: 50,
                  backgroundColor: Colors.violet50,
                  margin: 10,
                }}
              />
              <View
                style={{
                  width: 50,
                  height: 50,
                  backgroundColor: Colors.violet50,
                  margin: 10,
                }}
              />
              <View
                style={{
                  width: 50,
                  height: 50,
                  backgroundColor: Colors.violet50,
                  margin: 10,
                }}
              />
            </View>
          </View>
          <View
            margin-20
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <Button
              text70
              label="סגור"
              link
              style={{linkColor: Colors.red20}}
              onPress={() => setIsModalVisible(false)}
            />
            <Button
              text60
              linkColor={Colors.navigatorBG}
              label="גם אני כאן!"
              link
            />
          </View>
        </View>
      </Dialog>
    </>
  );
};
