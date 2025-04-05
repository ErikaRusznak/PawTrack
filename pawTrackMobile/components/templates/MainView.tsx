import { View } from "../Themed";
import { StyleSheet } from 'react-native';

const MainView = ({children}) => {

    return (
        <View style={styles.main}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    main: {
        flex: 1,
        marginHorizontal: 10
    }
})

export default MainView;