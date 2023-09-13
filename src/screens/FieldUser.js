import React, {useState, useEffect} from 'react';
import MapView, {Marker, Polyline, PROVIDER_GOOGLE} from 'react-native-maps';
import {decode} from '@mapbox/polyline';
// import Geolocation from "react-native-geolocation-service";

import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  PermissionsAndroid,
  Platform,
  Button,
} from 'react-native';

//import all the components we are going to use.
import Geolocation from '@react-native-community/geolocation';

const FieldUser = () => {
  const [currentLatitude, setCurrentLatitude] = useState('31.470370945909085');
  const [currentLongitude, setCurrentLongitude] = useState('74.23905619483946');

  const [locationStatus, setLocationStatus] = useState('');

  const [coords, setCoords] = useState([]);

  const getDirections = async (startLoc, destinationLoc) => {
    try {
      const KEY = 'AIzaSyADmYFvUDRaZ41fLRiCGhMPOcbNgNMHsHc'; //put your API key here.
      //otherwise, you'll have an 'unauthorized' error.
      let resp = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc}&destination=${destinationLoc}&key=${KEY}`,
      );
      let respJson = await resp.json();
      let points = decode(respJson.routes[0].overview_polyline.points);
      //   console.log(points);
      let coords = points.map((point, index) => {
        return {
          latitude: point[0],
          longitude: point[1],
        };
      });
      return coords;
    } catch (error) {
      return error;
    }
  };

  const [region, setRegion] = useState({
    latitude: 31.480130472084344,
    longitude: 74.36051899484,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const destination = {
    latitude: 31.470370945909085,
    longitude: 74.23905619483946,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  function postLocation() {
    // getOneTimeLocation();
    console.log('Current LATLNG: ' + region.latitude + '/' + region.longitude);
    getDirections(
      currentLatitude + ',' + currentLongitude,
      destination.latitude + ',' + destination.longitude,
    )
      .then(coords => setCoords(coords))
      .catch(err => console.log('Something went wrong'));
  }

  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'ios') {
        getOneTimeLocation();
        subscribeLocationLocation();
      } else {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Access Required',
              message: 'This App needs to Access your location',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            //To Check, If Permission is granted
            getOneTimeLocation();
            subscribeLocationLocation();
          } else {
            setLocationStatus('Permission Denied');
          }
        } catch (err) {
          console.warn(err);
        }
      }
    };
    requestLocationPermission();
    return () => {
      Geolocation.clearWatch(watchID);
    };
  }, []);

  const getOneTimeLocation = () => {
    setLocationStatus('Getting Location ...');
    Geolocation.getCurrentPosition(
      //Will give you the current location
      position => {
        setLocationStatus('You are Here');

        //getting the Longitude from the location json
        const currentLongitude = JSON.stringify(position.coords.longitude);

        //getting the Latitude from the location json
        const currentLatitude = JSON.stringify(position.coords.latitude);

        console.log('MyLatLng: ' + currentLatitude + '/' + currentLongitude);

        //Setting Longitude state
        setCurrentLongitude(currentLongitude);

        //Setting Longitude state
        setCurrentLatitude(currentLatitude);
      },
      error => {
        setLocationStatus(error.message);
      },
      {
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 1000,
      },
    );
  };

  const subscribeLocationLocation = () => {
    watchID = Geolocation.watchPosition(
      position => {
        //Will give you the location on location change

        setLocationStatus('You are Here');
        console.log(position);

        //getting the Longitude from the location json
        const currentLongitude = JSON.stringify(position.coords.longitude);

        //getting the Latitude from the location json
        const currentLatitude = JSON.stringify(position.coords.latitude);

        console.log('MyLatLng: ' + currentLatitude + '/' + currentLongitude);
        //Setting Longitude state
        setCurrentLongitude(currentLongitude);

        //Setting Latitude state
        setCurrentLatitude(currentLatitude);
      },
      error => {
        setLocationStatus(error.message);
      },
      {
        enableHighAccuracy: false,
        maximumAge: 1000,
      },
    );
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        //specify our coordinates.
        initialRegion={{
          latitude: 31.480130472084344,
          longitude: 74.36051899484,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        // onRegionChangeComplete={region => setRegion(region)}
      >
        {coords.length > 0 && (
          <Polyline
            coordinates={coords}
            strokeColor={'#000'}
            strokeWidth={6}
            // lineDashPattern={[1]}
          />
        )}
        <Marker coordinate={destination} pinColor="red" />
        <Marker
          coordinate={{
            latitude: parseFloat(currentLatitude),
            longitude: parseFloat(currentLongitude),
          }}
          pinColor="green"
        />
      </MapView>
      <View>
        <Button title="Refresh" onPress={() => getOneTimeLocation()} />
        <Button title="Postt" onPress={() => postLocation()} />
      </View>
    </View>
  );
};

export default FieldUser;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  text: {
    fontSize: 20,
    backgroundColor: 'lightblue',
  },
  bottomCon: {
    alignItems: 'center',
    marginVertical: 10,
  },
  TopCon: {
    alignItems: 'flex-start',
    marginHorizontal: 10,
    marginTop: 10,
  },
  boldText: {
    fontSize: 25,
    color: 'red',
    marginVertical: 16,
    textAlign: 'center',
  },
});
