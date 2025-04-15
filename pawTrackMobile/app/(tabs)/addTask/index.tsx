import MainView from "@/components/templates/MainView";
import { View, Text } from "@/components/Themed";
import React from 'react';
import { StyleSheet } from 'react-native';

const AddTaskScreen = () => {
  return (
    <MainView>
      <Text style={styles.title}>Home Screen</Text>
    </MainView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default AddTaskScreen;
