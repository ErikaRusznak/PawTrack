import React, { useState } from 'react';
import { Modal, View, StyleSheet, TouchableOpacity, Text, TextInput } from 'react-native';
import { TextMedium } from '@/components/StyledText';
import ImageUploader from './form/ImageUploader';
import { getTheme } from '@/components/Themed';
import { FontAwesome } from '@expo/vector-icons';
import { getOrCreateChat, updateChatLastMessage } from '@/src/Chat';
import { addMessage } from '@/src/Message';
import { db } from '@/firebase/firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { storage } from '@/firebase/firebaseConfig';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import uuid from 'react-native-uuid';
import Toast from 'react-native-toast-message';

type FoundPopupModalProps = {
  visible: boolean;
  onClose: () => void;
  post: any;
  foundPetForUserId: string;
};

const FoundPopupModal = ({ visible, onClose, foundPetForUserId }: FoundPopupModalProps) => {
  const theme = getTheme();
  const [details, setDetails] = useState('');
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [resetKey, setResetKey] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const senderId = await AsyncStorage.getItem('userId');
      if (!senderId) throw new Error('User ID not found');
      if (!foundPetForUserId) throw new Error('Recipient user ID not found');
      let pictureUrl = '';
      if (selectedImageUri) {
        const response = await fetch(selectedImageUri);
        const blob = await response.blob();
        const fileRef = ref(storage, `messages/${uuid.v4()}.jpg`);
        await uploadBytes(fileRef, blob);
        pictureUrl = await getDownloadURL(fileRef);
      }
      // Get or create chat and chatKey
      const { chatId, chatKey } = await getOrCreateChat(senderId, foundPetForUserId, details);
      // Add message
      await addMessage({
        chatKey,
        sentByUser: true,
        text: details,
        sentAt: new Date(),
        picture: pictureUrl,
      });
      // Update chat last message
      await updateChatLastMessage(chatId, details);
      onClose();
      Toast.show({ type: 'success', text1: 'Message sent!' });
      setResetKey((k) => k + 1);
      setDetails("");
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Failed to send message' });
      console.error('Failed to send message:', err);
      onClose();
    } finally {
      setSubmitting(false);
    }
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
            <TextInput
              style={styles.textarea}
              value={details}
              onChangeText={setDetails}
              placeholder="Details...."
              placeholderTextColor="#bbb"
              multiline
              numberOfLines={4}
            />
          </View>
          <ImageUploader onImageSelected={setSelectedImageUri} aspect1={16} aspect2={9} resetKey={resetKey} />
          <TouchableOpacity style={styles.submit} onPress={handleSubmit} disabled={submitting}>
            <TextMedium style={styles.submitText}>{submitting ? 'Submitting...' : 'Submit'}</TextMedium>
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
    color: '#443627',
    marginBottom: 6,
    alignSelf: 'flex-start',
  },
  textareaWrapper: {
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
    fontSize: 14,
    color: '#443627',
    padding: 12,
    fontFamily: 'Montserrat-Regular',
    textAlignVertical: 'top',
  },
  submit: {
    backgroundColor: '#d98324',
    paddingVertical: 8,
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
    fontSize: 18,
    textAlign: 'center',
  },
});

export default FoundPopupModal;
