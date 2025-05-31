import React, { useState } from 'react';
import { Modal, View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { TextMedium } from '@/components/StyledText';
import ImageUploader from './form/ImageUploader';
import { getTheme } from '@/components/Themed';
import { FontAwesome } from '@expo/vector-icons';

type FoundPopupModalProps = {
  visible: boolean;
  onClose: () => void;
  post: any;
}

const FoundPopupModal = ({ visible, onClose }: FoundPopupModalProps) => {
  const theme = getTheme();
  const [details, setDetails] = useState('');
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [resetKey, setResetKey] = useState(0);

  const handleSubmit = () => {
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity activeOpacity={1} onPress={e => e.stopPropagation()} style={styles.modalContainer}>
          <View style={styles.header}>
            <TextMedium style={styles.title}>Found</TextMedium>
            <FontAwesome name="paw" size={20} color={theme.orange} />
          </View>

          <TextMedium style={styles.label}>Details</TextMedium>
          <View style={styles.textareaWrapper}>
            <Text
              style={styles.textarea}
              numberOfLines={4}
              onPress={() => { }}
            >
              {details || 'Details....'}
            </Text>
          </View>
          <ImageUploader onImageSelected={setSelectedImageUri} aspect1={16} aspect2={9} resetKey={resetKey} />
          <TouchableOpacity style={styles.submit} onPress={handleSubmit}>
            <TextMedium style={styles.submitText}>Submit</TextMedium>
          </TouchableOpacity>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: 'flex-start',
    gap: 10,
    marginBottom: 18,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 28,
    padding: 28,
    width: "90%",
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute',
    top: 18,
    right: 18,
    zIndex: 2,
  },
  title: {
    fontSize: 28,
    color: '#443627',
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
    color: "#443627",
  },
  textareaWrapper: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#eee',
    marginBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  textarea: {
    minHeight: 80,
    fontSize: 16,
    color: '#443627',
    padding: 12,
    fontFamily: 'Montserrat-Regular',
  },
  submit: {
    backgroundColor: '#d98324',
    paddingHorizontal: 32,
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 18,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  submitText: {
    color: '#f2f6d0',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default FoundPopupModal;
