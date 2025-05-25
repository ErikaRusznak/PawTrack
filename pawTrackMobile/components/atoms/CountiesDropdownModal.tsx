import { Modal, TouchableOpacity, View, StyleSheet, ScrollView } from "react-native";
import { TextMedium, TextRegular } from "../StyledText";
import { ROMANIAN_COUNTIES } from "@/constants/Counties";

const CountiesDropdownModal = ({
    visible,
    onClose,
    onSelect,
}: {
    visible: boolean;
    onClose: () => void;
    onSelect: (county: string) => void;
}) => {
    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={dropdownStyles.overlay}>
                <View style={dropdownStyles.container}>
                    <TextMedium style={dropdownStyles.title}>Select County</TextMedium>
                    <ScrollView>
                        {ROMANIAN_COUNTIES.map((county) => (
                            <TouchableOpacity
                                key={county}
                                style={dropdownStyles.item}
                                onPress={() => {
                                    onSelect(county);
                                    onClose();
                                }}
                            >
                                <TextRegular>{county}</TextRegular>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                    <TouchableOpacity onPress={onClose} style={dropdownStyles.cancelButton}>
                        <TextMedium style={{ color: 'white' }}>Cancel</TextMedium>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const dropdownStyles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'flex-end',
    },
    container: {
        backgroundColor: 'white',
        padding: 20,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        maxHeight: '60%',
    },
    title: {
        fontSize: 18,
        marginBottom: 10,
        textAlign: 'center',
    },
    item: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
    cancelButton: {
        backgroundColor: '#d98324',
        paddingVertical: 12,
        borderRadius: 8,
        marginTop: 16,
        alignItems: 'center',
    },
});

export default CountiesDropdownModal;