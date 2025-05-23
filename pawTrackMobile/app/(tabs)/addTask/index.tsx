import { View, Text } from "@/components/Themed";
import React from 'react';
import { StyleSheet } from 'react-native';

const AddTaskScreen = () => {
  return (
    <View style={styles.main}>
      <Text style={styles.title}>Home Screen</Text>
    </View>
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
});

export default AddTaskScreen;
