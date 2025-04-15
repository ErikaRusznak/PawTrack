import { StyleSheet, SafeAreaView, ScrollView } from 'react-native';

const MainView = ({children}) => {

    return (
        <SafeAreaView style={styles.main}>
            <ScrollView>
              {children}
            </ScrollView>
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