import {View, Text, Button, StyleSheet} from 'react-native';
import React, {useState, useEffect} from 'react';
import MapView, {Marker, Polyline, PROVIDER_GOOGLE} from 'react-native-maps';
import {decode} from '@mapbox/polyline';

const FieldUser = () => {
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
    // console.log('LATLNG: ' + region.latitude + '/' + region.longitude);
    getDirections(
      region.latitude + ',' + region.longitude,
      destination.latitude + ',' + destination.longitude,
    )
      .then(coords => setCoords(coords))
      .catch(err => console.log('Something went wrong'));
  }

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
        onRegionChangeComplete={region => setRegion(region)}>
        {coords.length > 0 && (
          <Polyline
            coordinates={coords}
            strokeColor={'#000'}
            strokeWidth={6}
            // lineDashPattern={[1]}
          />
        )}
        <Marker coordinate={destination} pinColor="red" />
        <Marker coordinate={region} pinColor="green" />
      </MapView>
      <View style={styles.bottomCon}>
        <Button title="Post" onPress={() => postLocation()} />
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
});
