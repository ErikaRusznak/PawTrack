import { View, Text, StyleSheet, TouchableOpacity, Modal, Alert } from 'react-native';
import { theme } from '@/components/Themed';
import { Pet } from '@/src/Pets';
import { useRouter } from 'expo-router';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

type Props = {
  visible: boolean;
  onClose: () => void;
  pet: Pet;
  onMarkAsFound: (petId: string) => void;
  onDelete: (petId: string) => void;
};

export default function PetActionsPopup({ visible, onClose, pet, onMarkAsFound, onDelete }: Props) {
  const router = useRouter();
  
  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableOpacity style={styles.overlay} onPress={onClose}>
        <View style={styles.popup}>
          <TouchableOpacity style={styles.button} onPress={() => {
            onClose();
            router.replace(`/(tabs)/pets/view/${pet.id}` as any);
          }}>
            <View style={styles.iconTextRow}>
              <Feather name="eye" size={20} color={theme.brown} />
              <Text style={styles.text}>View</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={() => {
            onClose();
            router.replace(`/(tabs)/pets/edit/${pet.id}`);
          }}>
            <View style={styles.iconTextRow}>
              <Feather name="edit" size={20} color={theme.brown}  />
              <Text style={styles.text}>Edit</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={() => {
            onClose();
            Alert.alert("Delete Pet", "Are you sure you want to delete this pet?", [
              { text: "Cancel", style: "cancel" },
              { text: "Yes", onPress: () => onDelete(pet.id) }
            ]);
          }}>
            <View style={styles.iconTextRow}>
              <MaterialCommunityIcons name="trash-can" size={20} color={theme.brown}  />
              <Text style={[styles.text, { color: theme.brown }]}>Delete</Text>
            </View>
          </TouchableOpacity>

          {!pet.found && (
            <TouchableOpacity style={styles.button} onPress={() => {
              onClose();
              Alert.alert("Did you find your pet?", "", [
                { text: "No", style: "cancel" },
                { text: "Yes", onPress: () => onMarkAsFound(pet.id) }
              ]);
            }}>
              <View style={styles.iconTextRow}>
                <Feather name="check-circle" size={20} color={theme.brown}  />
                <Text style={[styles.text, { color: theme.brown }]}>Found</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  popup: {
    width: 200,
    backgroundColor: "#f2f6d0",
    borderRadius: 16,
    paddingVertical: 10,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
});
