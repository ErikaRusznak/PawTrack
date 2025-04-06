import { TextSemiBold } from "@/components/StyledText";
import { theme, View } from "@/components/Themed";
import { FontAwesome } from "@expo/vector-icons";
import { StyleSheet } from 'react-native';

const TitleAuthScreen = () => {
    return (
        <View style={styles.title}>
            <TextSemiBold style={styles.titleText}>PawTrack</TextSemiBold>
            <FontAwesome name="paw" size={28} color={theme.orange} />
        </View>
    );
};

const styles = StyleSheet.create({
  title: {
    backgroundColor: theme.beige,
    alignSelf: 'center',
    display: 'flex',
    flexDirection: 'row',
    gap: 10
  },
  titleText: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 32,
    textAlign: 'center',
    color: theme.brown
  },
});

export default TitleAuthScreen;