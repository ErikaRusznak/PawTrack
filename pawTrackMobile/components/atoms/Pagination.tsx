import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { TextRegular } from '../StyledText';

type Props = {
  onPrevious: () => void;
  onNext: () => void;
  currentPage: number;
  disablePrevious?: boolean;
  disableNext?: boolean;
};

export default function Pagination({ onPrevious, onNext, currentPage, disablePrevious, disableNext }: Props) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPrevious} disabled={disablePrevious} style={{ marginHorizontal: 10 }}>
        <TextRegular style={{ opacity: disablePrevious ? 0.4 : 1 }}>{'<'}</TextRegular>
      </TouchableOpacity>
      <TextRegular>{currentPage}</TextRegular>
      <TouchableOpacity onPress={onNext} disabled={disableNext} style={{ marginHorizontal: 10 }}>
        <TextRegular style={{ opacity: disableNext ? 0.4 : 1 }}>{'>'}</TextRegular>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10
  },
});

