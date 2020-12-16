import React, { useEffect, useState, useRef } from 'react';
import { Alert, StyleSheet, Text, View, TouchableOpacity, TextInput, Image } from 'react-native';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
import MapView, { Callout, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { createPortal, render } from 'react-dom';
import { MaterialIcons } from '@expo/vector-icons';
import { Foundation } from '@expo/vector-icons';
import { Button } from 'react-native-paper';
import { color, cond, Value } from 'react-native-reanimated';
import { ActivityIndicator, Colors, Appbar } from 'react-native-paper';
import { Camera } from 'expo-camera';

//Functie Datainladen
export const dataInladen = (props) => {
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

const Stack = createStackNavigator();

export const MapStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="MapScreen" component={MapScreen} options={{
        title: "Park & Ride Antwerpen", headerStyle: { backgroundColor: "red" }, headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }} />

      <Stack.Screen name="DetailsMap" component={DetailMapButton} />

      <Stack.Screen name="FotoMaken" component={FotoMaken} />

    </Stack.Navigator>
  )
}

export const ListStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ListScreen" component={ListScreen} options={{
        title: "Park & Ride Antwerpen", headerStyle: { backgroundColor: "red" }, headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }} />
      <Stack.Screen name="DetailsMap" component={DetailMapButton} options={{ headerStyle: { backgroundColor: "red" }, headerTintColor: '#fff' }} />

      <Stack.Screen name="FotoMaken" component={FotoMaken} />

    </Stack.Navigator>
  )
}

export const FavoriteStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Favo" component={Favo} options={{
        title: "Park & Ride Antwerpen", headerStyle: { backgroundColor: "red" }, headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }} />
      <Stack.Screen name="DetailsMap" component={DetailMapButton} options={{ headerStyle: { backgroundColor: "red" }, headerTintColor: '#fff' }} />

      <Stack.Screen name="FotoMaken" component={FotoMaken} />
    </Stack.Navigator>
  )
}

export const FotoMaken = ({ route }) => {

  const [hasPermission, setHasPermission] = useState(null);
  const camera = useRef();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);
  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const naam = route.params.data.Naam + "foto";

  const takePictures = async () => {
    let picture = await camera.current.takePictureAsync();
    console.log(picture.uri);
    console.log(naam);
    await AsyncStorage.setItem(naam, JSON.stringify(picture.uri));
  }

  return (
    <View style={{ width: '100%', height: '100%' }}>
      <Camera style={{ flex: 1 }} type={Camera.Constants.Type.back} ref={camera} />
      <Button style={{ marginBottom: 100, backgroundColor: "black" }} onPress={takePictures}>
        <Text style={{ color: "white", fontSize: 15 }}>Neem een Foto</Text>
      </Button>
    </View>
  )
}


const SaveFavo = async (props) => {
  try {
    await AsyncStorage.setItem(props.Naam, JSON.stringify(props));
  } catch (e) {
  }
}

export const Favo = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [data1, setData1] = useState([]);

  dataInladen(setData);

  //laden va favorieten in begin 
  useEffect(() => {
    let arrayA = [];
    if (data) {
      data.map(async (val) => {
        try {
          let dataHalen = JSON.parse(await AsyncStorage.getItem(val.Naam));
          if (dataHalen !== null) {
            arrayA.push(dataHalen)
            setData1([...arrayA]);
            console.log(arrayA)
          }
        }
        catch (e) {
        }
      })
    }
  }, [data])

  useEffect(() => {

    navigation.addListener('focus', async () => {
      let arrayA = [];
      if (data) {
        data.map(async (val) => {
          try {
            let dataHalen = JSON.parse(await AsyncStorage.getItem(val.Naam));
            if (dataHalen !== null) {
              arrayA.push(dataHalen)
              setData1([...arrayA]);
              console.log(arrayA)
            }
          }
          catch (e) {
          }
        })
      }
    })
  }, [data])

  if (data1 == null) {
    return <ActivityIndicator style={styles.dataLoading} animating={true} size="large" color={Colors.red800} />
  } else {
    return (
      <View style={{ marginTop: 15, backgroundColor: "white" }}>
        <ScrollView>
          {data1.map((val) => {
            return (
              <TouchableOpacity key={val.OBJECTID} onPress={() => { navigation.navigate('DetailsMap', { data: val }) }}>
                <View style={{ width: "100%", height: 50, margin: 5, backgroundColor: "red", }}>
                  <Text style={{ color: "white", fontSize: 15, marginTop: 10, justifyContent: "center", alignSelf: "center" }}>{val.Naam}</Text>
                  <Text style={{ color: "white", fontSize: 10, justifyContent: "center", alignSelf: "center" }} >{val.Gemeente + " " + val.Postcode}</Text>
                </View>
              </TouchableOpacity>
            )
          })}
        </ScrollView>
      </View>
    )
  }
}

//Functie Detail knop map
export const DetailMapButton = ({ route, navigation }) => {

  const [data1, setData1] = useState(null);
  const [showbutton, setShowbutton] = useState(true);
  const naam = route.params.data.Naam + "foto";

  const FotoOphalen = async () => {
    try {
      let dataHalen = JSON.parse(await AsyncStorage.getItem(naam));
      if (dataHalen !== null) {
        console.log(dataHalen)
        setData1(dataHalen)
      }
    }
    catch (e) {
    }
  }

  const DeleteFavorieten = async () => {
    try {
      await AsyncStorage.removeItem(route.params.data.Naam);
    } catch (e) { }
  }

  useEffect(() => {
    navigation.addListener('focus', async () => {
      FotoOphalen();
    })
  })


  return (
    <View style={styles.detailPaginaVanMap}>
      <View style={styles.detailPaginaVanMapView}><Text style={{ color: "white", fontSize: 20 }}>{route.params.data.Naam}</Text></View>
      {data1 !== null ? <Image source={{ uri: data1 }} style={styles.imageDetailPagina} resizeMode="stretch" /> : null}
      <TextInput style={styles.detailPaginaTitle} editable={false} value={'Naam'} />
      <Text style={styles.detailPaginaText}>{route.params.data.Naam}</Text>
      <TextInput style={styles.detailPaginaTitle2} editable={false} value={'Adres'} />
      <Text style={styles.detailPaginaText} >{route.params.data.Gemeente + " " + route.params.data.Postcode}</Text>
      <TextInput style={styles.detailPaginaTitle2} editable={false} value={'Aantal Plaatsen'} />
      <Text style={styles.detailPaginaText} >{route.params.data.Plaatsen}</Text>
      <TextInput style={styles.detailPaginaTitle2} editable={false} value={'Buslijnen'} />
      <Text style={styles.detailPaginaText} >{route.params.data.Buslijnen}</Text>
      <TextInput style={styles.detailPaginaTitle2} editable={false} value={'Tramlijnen'} />
      <Text style={styles.detailPaginaText} >{route.params.data.Tramlijnen}</Text>
      <Button style={styles.detailPaginaVanMapView}
        onPress={() => { SaveFavo(route.params.data) }} >
        <Text style={{ color: "white", fontSize: 15 }}>Voeg toe aan favorieten</Text>
      </Button>
      <Button style={styles.detailPaginaVanMapView}
        onPress={() => { DeleteFavorieten() }} >
        <Text style={{ color: "white", fontSize: 15 }}>Verwijderen van favorieten</Text>
      </Button>

      <Button style={styles.detailPaginaVanMapView} onPress={() => { navigation.navigate('FotoMaken', { data: route.params.data }) }} >
        <Text style={{ color: "white", fontSize: 15 }}>Neem een Foto</Text>
      </Button>
    </View>
  )
}

//Functie Map navigatie
export const MapScreen = ({ navigation }) => {
  const [markerClickt, setMarkerClickt] = useState(false)
  const [momdata, setMomdata] = useState("")
  const [data, setData] = useState([]);
  const [locatie, setLocatie] = useState("loading")


  //Data inladen
  dataInladen(setData);

  //Locatie ophalen
  useEffect(() => {
    (async () => {
      let position = await Location.getCurrentPositionAsync();
      setLocatie(position.coords);
    })();
  }, []);

  //
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
        ><Text style={{ color: "white" }}>Details</Text></Button>
      </View>
    )
  }

  //
  if (locatie == "loading") {
    return <ActivityIndicator style={styles.dataLoading} animating={true} size="large" color={Colors.red800} />
  }
  else {
    if (data == false) {
      return <ActivityIndicator style={styles.dataLoading} animating={true} size="large" color={Colors.red800} />
    }
    else {
      return (
        <View>
          <MapView style={{ width: "100%", height: "100%", zIndex: 0 }} region={{
            latitude: locatie.latitude,
            longitude: locatie.longitude,
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
}


//Functie List navigatie
export const ListScreen = ({ navigation }) => {
  const [data, setData] = useState([]);
  dataInladen(setData)

  return (
    <View style={{ marginTop: 15, backgroundColor: "white" }}>
      <ScrollView>
        {data.map((val) => {
          return (
            <TouchableOpacity key={val.OBJECTID} onPress={() => { navigation.navigate('DetailsMap', { data: val }) }}>
              <View style={{ width: "100%", height: 50, margin: 5, backgroundColor: "red", }}>
                <Text style={{ color: "white", fontSize: 15, marginTop: 10, justifyContent: "center", alignSelf: "center" }}>{val.Naam}</Text>
                <Text style={{ color: "white", fontSize: 10, justifyContent: "center", alignSelf: "center" }} >{val.Gemeente + " " + val.Postcode}</Text>
              </View>
            </TouchableOpacity>
          )
        })}
      </ScrollView>
    </View>
  )
}

//Functie Bottom navigatie
const Tab = createBottomTabNavigator();
export const BottomNavi = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator tabBarOptions={{ activeTintColor: "red", inactiveTintColor: "black" }}>

        <Tab.Screen name="Map" component={MapStack}
          options={{
            tabBarIcon: () => (
              <MaterialIcons name="map" size={24} color="red" />
            )
          }}
        />

        <Tab.Screen name="List" component={ListStack}
          options={{
            tabBarIcon: () => (
              <Foundation name="list" size={24} color="red" />
            )
          }}
        />

        <Tab.Screen name="Favorites" component={FavoriteStack}
          options={{
            tabBarIcon: () => (
              <MaterialIcons name="favorite" size={24} color="red" />
            )
          }}
        />

      </Tab.Navigator>
    </NavigationContainer>
  )
}


//Functie App
export default function App() {

  //Permission voor locatie
  const [hasPermission, setHasPermission] = useState(null);
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  });

  if (hasPermission === null) {
    return <View />
  }
  if (hasPermission === false) {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: "center", alignSelf: "center" }}><Text>No access to location...</Text></View>
  }

  //
  return (
    <BottomNavi />

  );
}

//Styles
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
    borderWidth: 1,
    borderColor: "black"
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
    padding: 7,
    borderWidth: 1,
    borderColor: "white",
    borderStyle: "solid",
    borderRadius: 25,
  },
  detailPaginaTitle: {
    fontSize: 14,
    marginLeft: 10,
    marginTop: 25,
    borderBottomColor: 'black',
    marginRight: 15,
    borderBottomWidth: 1,
  },
  detailPaginaTitle2: {
    fontSize: 14,
    marginLeft: 10,
    marginRight: 15,
    marginTop: 15,
    borderBottomColor: 'black',
    borderBottomWidth: 1,
  },
  detailPaginaText: {
    fontSize: 14,
    marginLeft: 10,
    color: "black",
    borderBottomColor: 'black',
    borderBottomWidth: 1
  },
  imageDetailPagina: {
    padding: 10,
    width: "90%",
    height: 120,
    alignSelf: "center",
  }


});