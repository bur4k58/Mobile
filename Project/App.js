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

export const BottomNavi = () => {

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

        <Tab.Screen name="Map" component={MapScreen} />
        <Tab.Screen name="List" component={ListScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  )
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
        <MapView style={{ width: "100%", height: "90%", marginTop: 40 }} region={{
          latitude: 51.260197,
          longitude: 4.402771,
          latitudeDelta: 0.5,
          longitudeDelta: 0.5
        }}>
          {articles.map(val => {
           
            return<Marker
              key={val.Naam}
              coordinate={{ latitude: val.Latitude , longitude: val.Longitude }}
              title = {val.Naam}
              description= {val.Gemeente + " " + val.District + " " + val.Postcode} />

          })}
          <Marker
            key="Marker1"
            coordinate={{ latitude: 50.814604, longitude: 4.386932 }}
            title="AP Hogeschool"
            description="Hier zijn we"
          />
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
