import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Text, View } from '@/components/Themed';
import { getUserProfile } from '@/src/User';
import {fetchNearbyVets, geocodeCounty, fetchVetDetails} from '@/google-maps/google-maps-service';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { Callout } from 'react-native-maps';
import { Linking } from 'react-native';

const SearchVetScreen = () => {

  const [vets, setVets] = useState<any>([]);
  const [region, setRegion] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVetId, setSelectedVetId] = useState<string | null>(null);
  const [selectedVetPhone, setSelectedVetPhone] = useState<string | null>(null);

  useEffect(() => {
    const loadVets = async () => {
      try {
        const id = await AsyncStorage.getItem('userId');
        if (!id) throw new Error('User ID not found in storage');

        const profile = await getUserProfile(id);
        if(!profile) return;
        const county = profile.county;

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
            >
              <Callout
                  onPress={async () => {
                    setSelectedVetId(vet.place_id);
                    setSelectedVetPhone(null);

                    try {
                      const phone = await fetchVetDetails(vet.place_id);
                      if (phone) {
                        setSelectedVetPhone(phone);
                        const url = `tel:${phone}`;
                        const supported = await Linking.canOpenURL(url);
                        if (supported) {
                          Linking.openURL(url);
                        } else {
                          Toast.show({ type: 'error', text1: 'Calling not supported on this device.' });
                        }
                      } else {
                        Toast.show({ type: 'info', text1: 'Phone number not available' });
                      }
                    } catch (error) {
                      Toast.show({ type: 'error', text1: 'Error fetching phone number' });
                    }
                  }}
              >
                <View style={{ width: 200 }}>
                  <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{vet.name}</Text>
                  <Text style={{ marginVertical: 4 }}>{vet.vicinity}</Text>
                  {selectedVetId === vet.place_id ? (
                      selectedVetPhone ? (
                          <Text style={{ color: 'blue', fontWeight: 'bold' }}>📞 Call: {selectedVetPhone}</Text>
                      ) : (
                          <Text style={{ color: 'gray' }}>Fetching phone...</Text>
                      )
                  ) : (
                      <Text style={{ color: 'gray' }}>Tap for calling</Text>
                  )}
                </View>
              </Callout>
            </Marker>



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