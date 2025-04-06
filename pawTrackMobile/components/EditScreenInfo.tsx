import React from 'react';
import { StyleSheet } from 'react-native';
import { TextBold, TextLight, TextMedium, TextRegular, TextSemiBold } from './StyledText';
import { View } from './Themed';

import MainView from './templates/MainView';

export default function EditScreenInfo({ path='' }: { path?: string }) {
  return (
    <MainView>
      <View style={styles.getStartedContainer}>
        <TextBold>
          This is a bold text
        </TextBold>

        <TextLight>
          This is a light text
        </TextLight>
        
        <TextMedium>
          This is a light text
        </TextMedium>

        <TextRegular>
          This is a light text
        </TextRegular>

        <TextSemiBold>
          This is a light text
        </TextSemiBold>

      </View>

      
    </MainView>
  );
}

const styles = StyleSheet.create({
  getStartedContainer: {
    alignItems: 'center',
    // marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightContainer: {
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    lineHeight: 24,
    textAlign: 'center',
  },
  helpContainer: {
    marginTop: 15,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
    fontWeight: 'bold'
  },
  helpLinkText: {
    textAlign: 'center',
  },
});
