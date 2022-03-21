import React, { useState, useEffect } from 'react'
import { Colors } from 'react-native-ui-lib';
import GetLocation from 'react-native-get-location'
Colors.loadSchemes({
    light: {
        screenBG: 'transparent',
        textColor: Colors.grey10,
        moonOrSun: Colors.yellow30,
        mountainForeground: Colors.green30,
        mountainBackground: Colors.green50
    },
    dark: {
        screenBG: Colors.grey10,
        textColor: Colors.white,
        moonOrSun: Colors.grey80,
        mountainForeground: Colors.violet10,
        mountainBackground: Colors.violet70
    }
});
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Animated,
    Dimensions,
    useColorScheme,
} from 'react-native';

import {
    Text,
    Button,
    Image,
    Toast,
    View
} from 'react-native-ui-lib'; //eslint-disable-line

import MapView, {Callout, Marker} from 'react-native-maps';




export const Home = () => {
    const [showToast, setToast] = useState(false)
    const [center, setCenter] = useState({lat: 32.0153719, lng: 24.7457522})
    useEffect(() => {
            GetLocation.getCurrentPosition({
                enableHighAccuracy: true,
                timeout: 15000,
            })
            .then(location => {
                setCenter({lat: location.latitude, lng: location.longitude})
            })
            .catch(error => {
                const { code, message } = error;
                console.warn(code, message);
            })
    }, [])
    return (
        <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', padding: 20, borderRadius: 20 }}>
            <MapView
                style={{ width: '100%', height: '30%' }}
                z
                region={{

                    latitude: center.lat,
                    longitude: center.lng,
                    latitudeDelta: 0.015,
                    longitudeDelta: 0.0121,
                }}
            >
                <Marker
                coordinate={{
                 latitude: center.lat,
                 longitude: center.lng   
                }}
                onPress={()=>console.warn('press')}
                title='markeron'
                description='my very own'
                >
                    <Callout
                    tooltip>
                        <View backgroundColor={Colors.mountainForeground} style={{width: '30%', height: '30%'}}>
                            <Text>Hello</Text>
                        </View>
                    </Callout>
                </Marker>
            </MapView>
            <Button
                onPress={() => setToast(true)}
                label={'ףףףףףףףףףתלחץ עליי דחוף'}
                supportRTL
                style={{marginTop: 30}}
            ></Button>
            <Toast

                visible={showToast}
                position={'bottom'}
                backgroundColor={Colors.violet40}
                message="אני בגינה ואני תכף הולך"
                onDismiss={() => setToast(false)}
                autoDismiss={3000}
                showDismiss={true}
                action={{ label: 'Undo', onPress: () => console.log('undo') }}
                showLoader={false}
                supportRTL
            />
        </View>
    );
}