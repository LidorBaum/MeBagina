import React, { useState, useEffect, useRef } from 'react';
import { Colors } from 'react-native-ui-lib';
import GetLocation from 'react-native-get-location';

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Animated,
  Dimensions,
  useColorScheme,
} from 'react-native';

import { Text, Button, Image, Toast, View } from 'react-native-ui-lib'; //eslint-disable-line

import MapView, { Callout, Marker } from 'react-native-maps';
import parkService from '../services/parkService';
import { ParkList } from '../cmps/ParkList';
import { useSelector, useDispatch } from 'react-redux';

const mapstyle = [
  {
    featureType: 'all',
    elementType: 'all',
    stylers: [
      {
        visibility: 'on',
      },
    ],
  },
  {
    featureType: 'all',
    elementType: 'labels',
    stylers: [
      {
        visibility: 'on',
      },
      {
        saturation: '-100',
      },
    ],
  },
  {
    featureType: 'all',
    elementType: 'labels.text.fill',
    stylers: [
      {
        saturation: 36,
      },
      {
        color: '#000000',
      },
      {
        lightness: 40,
      },
      {
        visibility: 'on',
      },
    ],
  },
  {
    featureType: 'all',
    elementType: 'labels.text.stroke',
    stylers: [
      {
        visibility: 'on',
      },
      {
        color: '#000000',
      },
      {
        lightness: 16,
      },
    ],
  },
  {
    featureType: 'all',
    elementType: 'labels.icon',
    stylers: [
      {
        visibility: 'on',
      },
    ],
  },
  {
    featureType: 'administrative',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#000000',
      },
      {
        lightness: 20,
      },
    ],
  },
  {
    featureType: 'administrative',
    elementType: 'geometry.stroke',
    stylers: [
      {
        color: '#000000',
      },
      {
        lightness: 17,
      },
      {
        weight: 1.2,
      },
    ],
  },
  {
    featureType: 'landscape',
    elementType: 'geometry',
    stylers: [
      {
        color: '#000000',
      },
      {
        lightness: 20,
      },
    ],
  },
  {
    featureType: 'landscape',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#4d6059',
      },
    ],
  },
  {
    featureType: 'landscape',
    elementType: 'geometry.stroke',
    stylers: [
      {
        color: '#4d6059',
      },
    ],
  },
  {
    featureType: 'landscape.natural',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#4d6059',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [
      {
        lightness: 21,
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#4d6059',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'geometry.stroke',
    stylers: [
      {
        color: '#4d6059',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [
      {
        visibility: 'on',
      },
      {
        color: '#7f8d89',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#7f8d89',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#7f8d89',
      },
      {
        lightness: 17,
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [
      {
        color: '#7f8d89',
      },
      {
        lightness: 29,
      },
      {
        weight: 0.2,
      },
    ],
  },
  {
    featureType: 'road.arterial',
    elementType: 'geometry',
    stylers: [
      {
        color: '#000000',
      },
      {
        lightness: 18,
      },
    ],
  },
  {
    featureType: 'road.arterial',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#7f8d89',
      },
    ],
  },
  {
    featureType: 'road.arterial',
    elementType: 'geometry.stroke',
    stylers: [
      {
        color: '#7f8d89',
      },
    ],
  },
  {
    featureType: 'road.local',
    elementType: 'geometry',
    stylers: [
      {
        color: '#000000',
      },
      {
        lightness: 16,
      },
    ],
  },
  {
    featureType: 'road.local',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#7f8d89',
      },
    ],
  },
  {
    featureType: 'road.local',
    elementType: 'geometry.stroke',
    stylers: [
      {
        color: '#7f8d89',
      },
    ],
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [
      {
        color: '#000000',
      },
      {
        lightness: 19,
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'all',
    stylers: [
      {
        color: '#2b3638',
      },
      {
        visibility: 'on',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [
      {
        color: '#2b3638',
      },
      {
        lightness: 17,
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#24282b',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'geometry.stroke',
    stylers: [
      {
        color: '#24282b',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'labels',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'labels.text',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'labels.icon',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
];

export const Home = ({ navigation }) => {
  const { loggedUser } = useSelector(state => state.userReducer);

  const markerRef = useRef(null);
  const markersRefArr = useRef([])
  const mapRef = useRef(null);
  const [showToast, setToast] = useState(false);
  const [toastText, setToastText] = useState('');
  const notify = text => {
    setToast(true);
    setToastText(text);
  };
  const [parks, setParks] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [center, setCenter] = useState({ lat: 32.0153719, lng: 24.7457522 });
  const getUserLocation = () => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    })
      .then(location => {
        setCenter({ lat: location.latitude, lng: location.longitude });
      })
      .catch(error => {
        const { code, message } = error;
        console.warn(code, message);
      });
  };

  useEffect(() => {
    getUserLocation();
    const getParks = async () => {
      // console.log('logged user 420', loggedUser);
      const res = await parkService.getAllParks(loggedUser?._id);
      console.log(res);
      if (res.error) return notify(res.error.message);
      setParks([...res]);
      let parksLocs = [];
      res.map(park => {
        parksLocs.push({ lat: park.coordinates.lat, lng: park.coordinates.lng });
      });
      setMarkers(parksLocs);
    };
    getParks();
  }, [loggedUser]);

  const onShowCallout = () => {
    markerRef.current.showCallout();
    mapRef.current.animateToRegion({
      latitude: center.lat,
      longitude: center.lng,
      latitudeDelta: 0.015,
      longitudeDelta: 0.0121,
    });
  };

  const onPanToMarker = (parkId) => {
    const index = parks.findIndex(park => park._id === parkId)
    markersRefArr.current[index].showCallout()
    mapRef.current.animateToRegion({
      latitude: parseFloat(parks[index].coordinates.lat),
      longitude: parseFloat(parks[index].coordinates.lng),
      latitudeDelta: 0.015,
      longitudeDelta: 0.0121,
    });
  }

  const onAddToFav = async (parkId) => {
    console.log(parkId, 'add to fav');
    const res = await parkService.addFavorite(parkId, loggedUser._id)
    if (res.error) {
      //NOTIFY
    }
    const index = parks.findIndex(park => parkId === park._id)
    const parksClone = [...parks]
    const parkObj = parks[index]
    parkObj.isFavorite = true
    parksClone.splice[index, 1, parkObj]
    setParks(parksClone)

  }

  const onRemoveFromFav = async (parkId) => {
    console.log(parkId, 'remove to fav');

    const res = await parkService.removeFavorite(parkId, loggedUser._id)
    if (res.error) {
      //NOTIFY
    }
    const index = parks.findIndex(park => parkId === park._id)
    const parksClone = [...parks]
    const parkObj = parks[index]
    parkObj.isFavorite = false
    parksClone.splice[index, 1, parkObj]
    setParks(parksClone)
  }

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
        style={{ width: '100%', height: '30%' }}
        customMapStyle={mapstyle}
        region={{
          latitude: center.lat,
          longitude: center.lng,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        }}
        ref={mapRef}
      >
        {/* <Marker
                    coordinate={{
                        latitude: center.lat,
                        longitude: center.lng
                    }}
                    onPress={() => console.warn('press')}
                    title='markeron'
                    description='my very own'
                >
                    <Callout
                        tooltip>
                        <View>
                            <View backgroundColor={Colors.mountainForeground} style={{ width: 150, alignItems: 'center', justifyContent: 'center', flexDirection: 'column', backgroundColor: '#fff', borderRadius: 6, borderColor: '#ccc', padding: 15, }} >
                                <Text style={{ color: 'green' }}>Hello</Text>
                            </View>
                            <View style={{ backgroundColor: 'transparent', marginTop: -0.6, alignSelf: "center", borderWidth: 16, borderTopColor: '#0f0' }} />
                            <View style={{ marginTop: -32, borderWidth: 16, borderTopColor: '#fff' }} />
                        </View>
                    </Callout>
                </Marker> */}
        {parks.map((park, index) => {
          return (
            <Marker
              key={index}
              identifier={park._id}
              title={park.name}
              description="my very own"
              ref={el => markersRefArr.current[index] = el}
              coordinate={{
                latitude: parseFloat(park.coordinates.lat),
                longitude: parseFloat(park.coordinates.lng),
              }}
            />
          );
        })}
      </MapView>
      {/* <Button
                onPress={() => notify('אני בגינה')}
                label={'ףףףףףףףףףתלחץ עליי דחוף'}
                supportRTL
                style={{ marginTop: 30, marginBottom: 20 }}
            ></Button> */}
      <ParkList parks={parks} navi={navigation} isLogged={Boolean(loggedUser)} onPanToMarker={onPanToMarker} onAddToFav={onAddToFav} onRemoveFromFav={onRemoveFromFav} />
      <Toast
        visible={showToast}
        position={'bottom'}
        backgroundColor={Colors.violet40}
        message={toastText}
        onDismiss={() => setToast(false)}
        autoDismiss={3000}
        showDismiss={true}
        action={{ label: 'Undo', onPress: () => console.log('undo') }}
        showLoader={false}
        supportRTL
      />
    </View>
  );
};
