import React, { useEffect, useState, Image } from 'react';
import { Alert, StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
import MapView, { Callout, Marker } from 'react-native-maps';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as Location from 'expo-location';
import { render } from 'react-dom';
import { MaterialIcons } from '@expo/vector-icons';
import { Foundation } from '@expo/vector-icons';
import { Button } from 'react-native-paper';
import { Value } from 'react-native-reanimated';

{/*
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
} */}


export const dataInladen = (props) =>{
  useEffect(() => {
    fetch('https://api.jsonbin.io/b/5fc054fc177c556ef9b35636/1')
      .then((response) => response.json())
      .then((responseJson) => {
        return responseJson;
      })
      .then(parking => {
        props(parking);
    
      })
      .catch(error => {
        console.error(error);
      });
  }, []);
}




export const BottomNavi = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Map" component={MapStack}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="map" size={24} color="black" />
            )
          }}
        />

        <Tab.Screen name="List" component={ListStack}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Foundation name="list" size={24} color="black" />
            )
          }}
        />

      </Tab.Navigator>
    </NavigationContainer>
  )
}


const Stack = createStackNavigator();

export const MapStack = () => {
  return (

    <Stack.Navigator>
      <Stack.Screen name="MapScreen" component={MapScreen} options={{ title: "Map Scherm" }} />
      <Stack.Screen name="DetailsMap" component={DetailMapButton} />
    </Stack.Navigator>
  )
}


export const ListStack = () => {
  return (

    <Stack.Navigator>
      <Stack.Screen name="ListScreen" component={ListScreen} options={{ title: "List Scherm" }} />
      <Stack.Screen name="DetailsMap" component={DetailMapButton}  />
    </Stack.Navigator>
  )
}



export const DetailMapButton = ({ route }) => {
  return (
    <View style={styles.detailPaginaVanMap}>
      <View style={styles.detailPaginaVanMapView}><Text style={{ color: "white", fontSize: 20 }}>{route.params.data.Naam}</Text></View>
      <TextInput style={styles.detailPaginaTitle} editable={false} value={'Naam'} />
      <Text style={styles.detailPaginaText}>{route.params.data.Naam}</Text>
      <TextInput style={styles.detailPaginaTitle2} editable={false} value={'Adres'} />
      <Text style={styles.detailPaginaText} >{route.params.data.Gemeente + " " + route.params.data.Postcode}</Text>
      <TextInput style={styles.detailPaginaTitle2} editable={false} value={'Aantal Plaatsen'} />
      <Text style={styles.detailPaginaText} >{route.params.data.Plaatsen}</Text>
      <View style={styles.detailPaginaVanMapView}><Text style={{ color: "white", fontSize: 20 }}>Bereikbaar Met</Text></View>
      <TextInput style={styles.detailPaginaTitle2} editable={false} value={'Buslijnen'} />
      <Text style={styles.detailPaginaText} >{route.params.data.Buslijnen}</Text>
      <TextInput style={styles.detailPaginaTitle2} editable={false} value={'Tramlijnen'} />
      <Text style={styles.detailPaginaText} >{route.params.data.Tramlijnen}</Text>
    </View>
  )
}


export const MapScreen = ({ navigation }) => {
  
  const [markerClickt, setMarkerClickt] = useState(false)
  const [momdata, setMomdata] = useState("")
  const [data, setData] = useState([]);

  dataInladen(setData)
  

  const detailView = () => {
    return (
      setMarkerClickt(true)
    )
  }

  const detailMarker = (val) => {
    return (
      <View style={styles.detailMarkerView}>
        <Text style={{ color: "black", fontSize: 20, marginTop: 10 }}>{val.Naam}</Text>
        <Text style={{ color: "black", fontSize: 18 }} >{val.Gemeente + " " + val.Postcode}</Text>
        <Button style={{ backgroundColor: "#ff1a1a", width: "80%", marginTop: 20 }}
          onPress={() => { navigation.navigate('DetailsMap', { data: val }) }}
        ><Text style={{color:"white"}}>Details</Text></Button>
      </View>
    )
  }
  if (data == false) {
    return <View style={styles.dataLoading}><Text>Data Loading...</Text></View>
  } else {
    return (
      <View>
        <MapView style={{ width: "100%", height: "100%", zIndex: 0 }} region={{
          latitude: 51.260197,
          longitude: 4.402771,
          latitudeDelta: 0.5,
          longitudeDelta: 0.5
        }}>
          {data.map(val => {
            return (
              <Marker
                key={val.Naam}
                coordinate={{ latitude: val.Latitude, longitude: val.Longitude }}
                image={require('../Project/assets/parking.png')}
                onPress={() => {
                  detailView()
                  setMomdata(val)
                }}>
              </Marker>
            )
          })}
        </MapView>
        {(markerClickt ? detailMarker(momdata) : <Text>False</Text>)}
      </View>)
  }
}



export const ListScreen = ({ navigation }) => {

  const [data, setData] = useState([]);
  dataInladen(setData)
  

  return (
    <View style={{marginTop:15,backgroundColor:"white"}}>
      <ScrollView>
      {data.map((val)=>{
        return(
        <TouchableOpacity  key={val.OBJECTID}  onPress={() => { navigation.navigate('DetailsMap', { data: val }) }}>
        <View style={{width:"100%",height:50,margin:5,backgroundColor:"red",}}>
        <Text style={{ color: "white", fontSize: 15, marginTop: 10 , justifyContent:"center",alignSelf:"center" }}>{val.Naam}</Text>
        <Text style={{ color: "white", fontSize: 10, justifyContent:"center",alignSelf:"center" }} >{val.Gemeente + " " + val.Postcode}</Text>
  
        
        </View>
        </TouchableOpacity>
        )
      })}
      </ScrollView>
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
  },
  popUpDetailMarker: {
    backgroundColor: "#d0dbcc",
    height: 100,
    width: 330,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    padding: 10
  },
  buttonDetails: {
    height: 40,
    width: 200,
    borderColor: "black",
    borderWidth: 1,
    borderStyle: "solid",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "black",
    borderRadius: 20,
    position: "relative",
    top: 5,
    marginBottom: 15
  },
  textInButton: {
    color: "white",
    fontSize: 20,
    fontFamily: "Arial"
  },
  detailMarkerView: {
    width: "90%",
    height: 120,
    zIndex: 1,
    position: "absolute",
    top: "75%",
    backgroundColor: "#E5E7E9",
    alignItems: "center",
    alignSelf: "center",
    borderRadius: 10,
    borderWidth:1,
    borderColor:"black"
  },
  dataLoading: {
    flex: 1,
    justifyContent: "center",
    alignSelf: "center",
    alignItems: "center"
  },
  detailPaginaVanMap: {
    backgroundColor: "white",
    width: "95%",
    height: "85%",
    alignSelf: "center",
    marginTop: 5,
    borderWidth: 2,
    borderStyle: "solid",
    borderColor: "black",
    borderRadius: 20
  },
  detailPaginaVanMapView: {
    alignSelf: "center",
    backgroundColor: "black",
    padding: 10,
    borderWidth: 1,
    borderColor: "white",
    borderStyle: "solid",
    borderRadius: 25,
    marginTop: 10
  },
  detailPaginaTitle: {
    fontSize: 20,
    marginLeft: 10,
    marginTop: 25,
    borderBottomColor: 'black',
    marginRight: 15,
    borderBottomWidth: 1,
  },
  detailPaginaTitle2: {
    fontSize: 20,
    marginLeft: 10,
    marginRight: 15,
    marginTop: 15,
    borderBottomColor: 'black',
    borderBottomWidth: 1,


  },
  detailPaginaText: {
    fontSize: 20,
    marginLeft: 10,
    color: "black",
    borderBottomColor: 'black',
    borderBottomWidth: 1
  },


});