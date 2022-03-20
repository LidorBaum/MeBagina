/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

 import React, {useState} from 'react';
 import type { Node } from 'react';
 import {
   SafeAreaView,
   ScrollView,
   StatusBar,
   StyleSheet,
 
   useColorScheme,
   View,
 } from 'react-native';
 import { Colors } from 'react-native-ui-lib';
 import { NavigationContainer } from '@react-navigation/native';
 import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
 import { I18nManager } from 'react-native';
 
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
   // Colors,
   DebugInstructions,
   Header,
   LearnMoreLinks,
   ReloadInstructions,
 } from 'react-native/Libraries/NewAppScreen';
 
 import {
   Text,
   Button,
   Image,
   Toast
 
 } from 'react-native-ui-lib'; //eslint-disable-line
 I18nManager.forceRTL(true);
 
 import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
 const Tab = createBottomTabNavigator();
 function HomeScreen() {
   const [showToast, setToast] = useState(false)
 return (
     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
       <Text>Home!</Text>
       <Image
         key={`1`}
         source={{ uri: 'https://res.cloudinary.com/echoshare/image/upload/v1647787116/MeBagina/photo_2022-03-20_16-37-18_gtyqdk.jpg' }}
         cover={true}
       />
       <Button
         onPress={() => setToast(true)}
         label={'ףףףףףףףףףתלחץ עליי דחוף'}
         supportRTL
 
         ></Button>
       <Toast
       
         visible={showToast}
         position={'bottom'}
         backgroundColor={Colors.violet40}
         message="אני בגינה ואני תכף הולך"
         onDismiss={()=>setToast(false)}
         autoDismiss={3000}
         showDismiss={true}
         action={{ label: 'Undo', onPress: () => console.log('undo') }}
         showLoader={false}
         supportRTL
       />
     </View>
   );
 }
 
 function SettingsScreen() {
   return (
     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
       <Text>Settings!</Text>
     </View>
   );
 }
 
 const App: () => Node = () => {
   const isDarkMode = useColorScheme() === 'dark';
 
   const backgroundStyle = {
     backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
     flex: 1
   };
 
   return (
     <NavigationContainer>
       <SafeAreaView style={backgroundStyle}>
         <Tab.Navigator
           screenOptions={({ route }) => ({
             tabBarIcon: ({ focused, color, size }) => {
               let iconName;
 
               if (route.name === 'Home') {
                 iconName = focused
                   ? 'comments'
                   : 'comments';
               } else if (route.name === 'Settings') {
                 iconName = focused ? 'paw-claws' : 'money-bill-1';
               }
 
               // You can return any component that you like here!
               return <FontAwesome5 name={iconName} solid={focused} size={size} color={color} />;
             },
             tabBarActiveTintColor: 'tomato',
             tabBarInactiveTintColor: 'gray',
             headerShown: false
 
           })}
         >
           <Tab.Screen name="Home" component={HomeScreen} />
           <Tab.Screen name="Settings" component={SettingsScreen} />
         </Tab.Navigator>
       </SafeAreaView>
     </NavigationContainer>
   );
 };
 
 const styles = StyleSheet.create({
   sectionContainer: {
     marginTop: 32,
     paddingHorizontal: 24,
   },
   sectionTitle: {
     fontSize: 24,
     fontWeight: '600',
   },
   sectionDescription: {
     marginTop: 8,
     fontSize: 18,
     fontWeight: '400',
   },
   highlight: {
     fontWeight: '700',
   },
 });
 
 export default App;
 