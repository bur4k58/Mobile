import React,{ useEffect, useState} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {createStackNavigator} from "@react-navigation/stack";
import {NavigationContainer} from "@react-navigation/native";
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
import MapView, {Marker} from 'react-native-maps';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as Location from 'expo-location';

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
      screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Map') {
              iconName = focused ? 'ios-information-circle' : 'ios-information-circle-outline';
            } else if (route.name === 'List') {
              iconName = focused ? 'ios-list-box' : 'ios-list';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: 'tomato',
          inactiveTintColor: 'gray',
        }}>

        <Tab.Screen name ="Map" component={MapScreen} />
        <Tab.Screen name ="List" component={ListScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export const MapScreen = (props) =>{
  const [locatie, setLocatie] = useState(undefined);
  
  async function GetMapData() {
    try {
      let response = await fetch(
        'https://api.jsonbin.io/b/5fba4cffa825731fc0a115f5/1',
      );
      let responseJson = await response.json();
      const jsonValue = JSON.stringify(responseJson)
      await AsyncStorage.setItem('@storage_Key', jsonValue)
    } catch (error) {
      console.error(error);
    }
  }

  return(
    <View style={styles.container}>
      {locatie &&
      <MapView style={{flex:1}}
        region={{
          latitude: locatie.latitude,
          longitude: locatie.longitude,
          latitudeDelta: locatie.latitudeDelta,
          longitudeDelta: locatie.longitudeDelta
        }}
      >
      </MapView>}
      </View>
  )
}

export const ListScreen = () =>{
  return(
    <View>
      <Text style={{textAlign: "center"}}>hell</Text>
    </View>
  )
}


const Tab = createBottomTabNavigator();

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  }
});
