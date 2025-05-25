import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Text, View } from '@/components/Themed';
import { getUserProfile } from '@/src/User';
import {fetchNearbyVets, geocodeCounty} from '@/google-maps/google-maps-service';
import AsyncStorage from "@react-native-async-storage/async-storage";

const SearchVetScreen = () => {

  const [vets, setVets] = useState([]);
  const [region, setRegion] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const loadVets = async () => {
      try {
        const id = await AsyncStorage.getItem('userId');
        if (!id) throw new Error('User ID not found in storage');
        const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
        const profile = await getUserProfile(id);
        const county = profile.county

        const { lat, lng } = await geocodeCounty(county)

        setRegion({
          latitude: lat,
          longitude: lng,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        });

        const vetsData = await fetchNearbyVets(lat, lng)
        setVets(vetsData);
      } catch (error) {
        console.error('Error loading vets:', error);
      } finally {
        setLoading(false);
      }
    };

    loadVets();
  }, []);

  if (loading) {
    return (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Loading map and nearby vets...</Text>
        </View>
    );
  }

  if (!region) {
    return (
        <View style={styles.center}>
          <Text>Could not load location</Text>
        </View>
    );
  }

  return (
      <MapView style={styles.map} region={region}>
        {vets.map((vet, index) => (
            <Marker
                key={index}
                coordinate={{
                  latitude: vet.geometry.location.lat,
                  longitude: vet.geometry.location.lng,
                }}
                title={vet.name}
                description={vet.vicinity}
            />
        ))}
      </MapView>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    marginHorizontal: 20,
    marginVertical: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  map: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SearchVetScreen;