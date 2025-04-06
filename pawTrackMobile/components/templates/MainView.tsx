import { View } from "../Themed";
import { StyleSheet, SafeAreaView } from 'react-native';

const MainView = ({children}) => {

    return (
        <SafeAreaView style={styles.main}>
            {children}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    main: {
        flex: 1,
        marginHorizontal: 15,
        marginVertical: 10,
    }
})

export default MainView;