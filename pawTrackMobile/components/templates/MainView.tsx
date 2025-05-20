import { StyleSheet, SafeAreaView, ScrollView } from 'react-native';

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
        marginHorizontal: 20,
        marginVertical: 10,
    }
})

export default MainView;