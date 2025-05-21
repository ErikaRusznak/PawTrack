import { StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { theme } from '../Themed';

const MainView = ({children}) => {

    return (
        <SafeAreaView style={styles.main}>
            <ScrollView nestedScrollEnabled={true}>
              {children}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    }
})

export default MainView;