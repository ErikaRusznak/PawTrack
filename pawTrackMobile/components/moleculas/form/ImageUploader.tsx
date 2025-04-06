import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {theme} from "@/components/Themed";
import {TextMedium} from "@/components/StyledText";



const ImageUploader = () => {
    const handleUpload = () => {
        console.log('Upload pressed');
    };

    return (
        <>
            <TextMedium style={styles.label}>Picture</TextMedium>
            <TouchableOpacity style={styles.uploadBox} onPress={handleUpload}>
                <MaterialCommunityIcons name="upload" size={36} color="#E19133" />
                <Text style={styles.uploadText}>Click to upload</Text>
            </TouchableOpacity>
        </>
    );
}

const styles = StyleSheet.create({
    label: {
        fontSize: 14,
        marginBottom: 4,
        color: theme.brown,
    },
    uploadBox: {
        height: 130,
        borderWidth: 2,
        borderColor: '#E19133',
        borderStyle: 'dashed',
        borderRadius: 16,
        backgroundColor: "#f5f5f5",
        justifyContent: 'center',
        alignItems: 'center',
        // iOS shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        // Android shadow
        elevation: 4,
        marginBottom: 16,
    },
    uploadText: {
        marginTop: 8,
        color: theme.orange,
        fontSize: 16,
        fontWeight: '500',
    },
});

export default ImageUploader;