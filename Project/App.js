import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
import MapView, { Marker } from 'react-native-maps';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as Location from 'expo-location';
import { render } from 'react-dom';
import { MaterialIcons } from '@expo/vector-icons';
import { Foundation } from '@expo/vector-icons';

export const BottomNavi = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Map" component={MapScreen} 
        options={{tabBarIcon: ({ color, size }) => (
          <MaterialIcons name="map" size={24} color="black" />
          )}}
          />

        <Tab.Screen name="List" component={ListScreen} 
        options={{tabBarIcon: ({ color, size }) => (
          <Foundation name="list" size={24} color="black" />
          )}}
          />

      </Tab.Navigator>
    </NavigationContainer>
  )
}


export const locataieOphalen = () => {
  //Permision locatie
  const [hasPermission, setHasPermission] = useState(null);

  useEffect(() => {
    (async () => {
    const { status } = await Location.requestPermissionsAsync();
    setHasPermission(status === 'granted');
    })();
  });

  if (hasPermission === null) {
    return <View/>
  }
  if (hasPermission === false) {
    return <Text>No access to location</Text>
  }
      

  //Locatie ophalen
  const [location, setLocation] = useState('Loading');
  useEffect(() => {
    (async() => {
      let position = await Location.getCurrentPositionAsync();
      setLocation(JSON.stringify(position));
      })();
    },[]);
}

export const MapScreen = () => {

  const URL = 'https://api.jsonbin.io/b/5fba91b0522f1f0550cc2e57/2';
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(URL)
      .then((response) => response.json())
      .then((responseJson) => {
        return responseJson;
      })
      .then(parking => {
        setArticles(parking);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);


  if (loading) {
    return <Text>Data Loading...</Text>
  } else {
    return (
      <View>
        <MapView style={{ width: "100%", height: "100%", marginTop: 40 }} region={{
          latitude: 51.260197,
          longitude: 4.402771,
          latitudeDelta: 0.5,
          longitudeDelta: 0.5
        }}>
          {articles.map(val => {
            return<Marker
              key={val.Naam}
              coordinate={{ latitude: val.Latitude , longitude: val.Longitude }}
              image={require('../Project/assets/park.png')} 
              title = {val.Naam}
              description= {val.Gemeente + " " + val.District + " " + val.Postcode} 
              />
          })}
        </MapView>
      </View>)
  }
}

export const ListScreen = () => {
  return (
    <View>
      <Text style={{ textAlign: "center" }}>hell</Text>
    </View>
  )
}


export default function App() {
  return (
    <BottomNavi />
  );
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
