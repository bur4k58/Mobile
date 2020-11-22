import React,{ useEffect, useState} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {createStackNavigator} from "@react-navigation/stack";
import {NavigationContainer} from "@react-navigation/native";
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
import MapView, {Marker} from 'react-native-maps';
import { MaterialIcons } from '@expo/vector-icons';
import { Foundation } from '@expo/vector-icons';


//Functie Map
export const MapScreen = (props) =>{
  const [locatie, setLocatie] = useState(undefined);

  return(
    <View style={styles.container}>
      <MapView style={{width:"100%", height:"100%"}}
        region={{
        latitude: 50.814604,
        longitude: 4.386932,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
       }}
      >
      <Marker
        key="Marker1"
        coordinate={{latitude: 50.814604, longitude: 4.386932}}
        title="AP Hogeschool"
        description="Hier zijn we"
      />
      </MapView>
   </View>
  )
}

//Functie Lijst
export const ListScreen = () =>{
  return(
    <View>
      <Text style={{textAlign: "center"}}>hell</Text>
    </View>
  )
}

//App
const Tab = createBottomTabNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name ="Map" component={MapScreen} options={{tabBarIcon: ({color, size}) => (
          <MaterialIcons name="map" size={24} color="black" />
        )}
        }/>
        <Tab.Screen name ="List" component={ListScreen} options={{tabBarIcon: ({color, size}) => (
          <Foundation name="list" size={24} color="black" />
        )}
        }/>
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  }
});
