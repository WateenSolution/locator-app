//import all the components we are going to use.
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import React, {useEffect, useRef, useState} from 'react';
// import Geolocation from "react-native-geolocation-service";
import {
  Alert,
  Button,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';

const FieldUser = () => {
  const [deviceid, setDeviceID] = useState('');

  const [currentLatitude, setCurrentLatitude] = useState('0.0');
  const [currentLongitude, setCurrentLongitude] = useState('0.0');
  const [locationStatus, setLocationStatus] = useState('');
  const mapRef = useRef(null);
  async function postLocation(deviceid, lat, lng) {
    const bodyParameters = {
      deviceID: deviceid,
      latitude: lat,
      longitude: lng,
    };
    try {
      const res = await axios.post(
        'https://wateen.tutorialsbites.com/api/add_location', // 'http://172.26.50.18:8000/api/add_location',
        bodyParameters,
      );
      if (res) {
        Alert.alert('Success', 'Your Location Posted Successfully');
      }
    } catch (error) {
      console.log(error);
    }
  }

  function postHandler() {
    if (currentLatitude !== '0.0') {
      postLocation(deviceid, currentLatitude, currentLongitude);
    } else {
      console.log('postHandler: location null');
      setLocationStatus('Turn on GPS');
    }
  }

  useEffect(() => {
    var uniqueid = DeviceInfo.getDeviceId();
    setDeviceID(uniqueid);

    const requestLocationPermission = async () => {
      if (Platform.OS === 'ios') {
        getOneTimeLocation();
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
      Geolocation.clearWatch();
    };
  }, []);

  const getOneTimeLocation = () => {
    setLocationStatus('Getting Location ...');
    Geolocation.getCurrentPosition(
      //Will give you the current location
      position => {
        //getting the Longitude from the location json
        const currentLongitude = JSON.stringify(position.coords.longitude);
        mapRef?.current?.animateToRegion({
          latitude: position?.coords.latitude,
          longitude: position?.coords.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        });

        //getting the Latitude from the location json
        const currentLatitude = JSON.stringify(position.coords.latitude);
        setLocationStatus(currentLatitude + '/' + currentLongitude);
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

  return (
    <View style={styles.container}>
      <MapView
        zoomEnabled
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        //specify our coordinates.
        initialRegion={{
          latitude: 31.480130472084344,
          longitude: 74.36051899484,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation={true}
        // onRegionChangeComplete={region => setRegion(region)}
      ></MapView>

      <View style={styles.buttonsBar}>
        <View style={styles.buttons}>
          <Button title="Refresh" onPress={() => getOneTimeLocation()} />
        </View>
        <View style={styles.buttons}>
          <Button title="Post" onPress={() => postHandler()} />
        </View>
      </View>
      <View>
        <Text style={styles.boldText}>{locationStatus}</Text>
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
  buttonsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttons: {
    backgroundColor: 'green',
    width: '40%',
    height: 40,
    margin: 10,
  },
});
