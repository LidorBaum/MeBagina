import React, { useState } from 'react';
import { Image, Colors, View, Text } from 'react-native-ui-lib';
import {
    TouchableOpacity,
    Platform,
    Linking
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import IconBadge from 'react-native-icon-badge';
import { ChatBox } from './ChatBox';
import { LogBox } from 'react-native';
import { useDispatch } from 'react-redux';
import { newNotification } from '../redux/actions';

export const Park = ({ route }) => {
    LogBox.ignoreLogs([
        'Non-serializable values were found in the navigation state',
    ]);
    const { park, onAddToFav, onRemoveFromFav } = route.params;
    const dispatch = useDispatch();

    const [parkObj, setParkObj] = useState(park);
    const [imageResizeMode, setImageResizeMode] = useState('cover')
    console.log(parkObj);
    const toggleFav = () => {
        let result;
        if (parkObj.isFavorite) result = removeFromFav(parkObj._id);
        else result = addToFav(parkObj._id);
        if (result) {
            setParkObj(prevPark => ({ ...prevPark, isFavorite: !prevPark.isFavorite }));
        }
    };
    const addToFav = () => {
        return onAddToFav(parkObj._id);
    };
    const removeFromFav = () => {
        return onRemoveFromFav(parkObj._id);
    };

    navigateToPark = () => {
        const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
        const latLng = `${parkObj.coordinates.lat},${parkObj.coordinates.lng}`;
        const label = `${parkObj.address} ${parkObj.city}`;
        const url = Platform.select({
            ios: `${scheme}${label}@${latLng}`,
            android: `${scheme}${latLng}(${label})`
        });
        Linking.openURL(url);
    }
    const notify = (text, severity) => {
        dispatch(newNotification({ toastText: text, toastSeverity: severity }));
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
            <Image
                source={{
                    uri: parkObj.image,
                }}
                errorSource={require('../assets/logo.png')}
                backgroundColor={Colors.screenBG}
                style={{ width: '100%', height: 200 }}
                resizeMode={imageResizeMode}
                onError={() => {
                    setImageResizeMode('contain')
                    notify('עדיין לא הוסיפו תמונה של הגינה, רוצה להיות הראשון?', 'warn')
                }}
            />
            <View
                style={{
                    height: 100,
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    padding: 10,
                }}
            >
                <View
                    style={{
                        width: '50%',
                    }}
                >
                    <Text
                        style={{
                            fontSize: 40,
                            color: Colors.textColor,
                        }}
                    >
                        {parkObj.name}
                    </Text>
                    <Text
                        style={{
                            fontSize: 25,
                            color: Colors.textColor,
                        }}
                    >
                        {parkObj.address}, {parkObj.city}
                    </Text>
                </View>
                <View
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'row-reverse',
                    }}
                >
                    <TouchableOpacity onPress={toggleFav}>
                        <MaterialCommunityIcons
                            name={parkObj.isFavorite ? 'heart' : 'heart-outline'}
                            size={45}
                            color={'tomato'}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{
                            marginRight: 10,
                        }}
                    >
                        <IconBadge
                            MainElement={
                                <FontAwesome5 name={'dog'} size={35} color={'#ffe261'} />
                            }
                            BadgeElement={
                                <Text style={{ color: '#000000' }}>{parkObj.dogs}</Text>
                            }
                            IconBadgeStyle={{
                                position: 'absolute',
                                top: -15,
                                right: 35,
                                width: 20,
                                height: 20,
                                borderRadius: 15,
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: '#ffe261',
                            }}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={navigateToPark}
                        style={{
                            marginRight: 15,
                        }}>
                        <MaterialCommunityIcons
                            name={'navigation-variant'}
                            size={45}
                            color={Colors.navigatorBG}
                        />
                    </TouchableOpacity>
                </View>
            </View>
            <View
                style={{
                    width: '100%',
                    height: '50%',
                    borderRadius: 20,
                    marginBottom: 80,
                }}
            >
                <View
                    style={{
                        width: '100%',
                        height: '100%',
                        borderTopWidth: 4,
                        borderBottomWidth: 5,
                        borderRadius: 5,
                    }}
                >
                    <ChatBox parkId={parkObj._id} />
                </View>
            </View>
        </View>
    );
};
