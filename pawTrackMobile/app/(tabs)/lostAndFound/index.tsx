import { Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { getTheme, Text, View } from '@/components/Themed';
import { TextMedium, TextRegular } from '@/components/StyledText';
import Feather from '@expo/vector-icons/build/Feather';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserProfile } from '@/src/User';
import CountiesDropdownModal from '@/components/atoms/CountiesDropdownModal';

const LostAndFoundScreen = () => {

  const theme = getTheme();
  const [countiesDropdownVisible, setCountiesDropdownVisible] = useState<boolean>(false);
  const [countySelected, setCountySelected] = useState<string>()

  const setInitialData = async () => {
    const id = await AsyncStorage.getItem('userId');
    if (!id) throw new Error('User ID not found in storage');

    const profile = await getUserProfile(id);
    if (!profile) return;
    setCountySelected(profile.county);
  }

  useEffect(() => {
    setInitialData();
  }, [])

  const addPost = () => {

  }

  return (
    <View style={styles.main}>
      <View style={styles.filterAndAdd}>
        <TouchableOpacity style={styles.countyFilter} onPress={() => setCountiesDropdownVisible(true)}>
          <TextRegular style={styles.countyText}>{countySelected}</TextRegular>
          <Feather name="chevron-down" size={20} color={theme.brown} />
        </TouchableOpacity>
        <TouchableOpacity onPress={addPost} style={styles.addPostButton}>
          <TextMedium style={styles.addPostText}>Add post</TextMedium>
        </TouchableOpacity>
        <CountiesDropdownModal
          visible={countiesDropdownVisible}
          onClose={() => setCountiesDropdownVisible(false)}
          onSelect={(county) => setCountySelected(county)}
        />
      </View>
      <View>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    marginHorizontal: 20,
    marginVertical: 10,
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  filterAndAdd: {
    marginTop: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  countyFilter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countyText: {
    fontSize: 28,
    color: '#443627',
    marginRight: 6,
  },
  addPostButton: {
    backgroundColor: "#d98324",
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 16,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  addPostText: {
    color: "#f2f6d0",
    fontSize: 20,
  },

});

export default LostAndFoundScreen;
