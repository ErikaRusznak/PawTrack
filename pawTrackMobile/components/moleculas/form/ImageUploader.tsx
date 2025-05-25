import React, { useState, useEffect } from 'react';
import { Text, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TextMedium } from '@/components/StyledText';

const ImageUploader = ({ onImageSelected, aspect1 = 1, aspect2 = 1, resetKey }: { onImageSelected: (uri: string) => void, aspect1?: number, aspect2?: number, resetKey?: number }) => {
  const [previewUri, setPreviewUri] = useState<string | null>(null);

  useEffect(() => {
    setPreviewUri(null);
  }, [resetKey]);

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [aspect1, aspect2],
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const uri = result.assets[0].uri;
        setPreviewUri(uri);
        onImageSelected(uri);
      }
    } catch (error) {
      console.error('[Image Picker Error]', error);
      Alert.alert('Error', 'Could not pick the image');
    }
  };

  return (
    <>
      <TextMedium style={styles.label}>Picture</TextMedium>

      {previewUri && (
        <Image source={{ uri: previewUri }} style={styles.imagePreview} resizeMode="cover" />
      )}

      <TouchableOpacity style={styles.uploadBox} onPress={handlePickImage}>
        <MaterialCommunityIcons name="upload" size={30} color="#E19133" />
        <Text style={styles.uploadText}>Click to upload</Text>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    marginBottom: 4,
    color: "#443627",
  },
  uploadBox: {
    height: 70,
    borderWidth: 2,
    borderColor: "#d98324",
    borderStyle: 'dashed',
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  uploadText: {
    marginTop: 8,
    color:"#d98324",
    fontSize: 16,
    fontWeight: '500',
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 12,
    marginBottom: 12,
    alignSelf: 'center',
  },
});

export default ImageUploader;
