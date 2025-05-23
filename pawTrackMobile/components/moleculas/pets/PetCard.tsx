import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Pet } from '@/src/Pets';
import { Feather } from '@expo/vector-icons';
import { TextLight, TextMedium } from '@/components/StyledText';
import { getTheme } from '@/components/Themed';

type PetCardProps = {
  pet: Pet;
  onOptionsPress?: (pet: Pet) => void;
};

const PetCard = ({ pet, onOptionsPress }: PetCardProps) => {
  const theme = getTheme();
  return (
    <View style={[styles.card, !pet.found && styles.cardRed]}>
      {pet.picture && (
        <Image source={{ uri: pet.picture }} style={styles.image} />
      )}
      <View style={styles.info}>
        <TextMedium style={styles.name}>{pet.name}</TextMedium>
        <TextLight style={styles.age}>{pet.age} {pet.age === 1 ? 'year' : 'years'} old</TextLight>
      </View>
      <TouchableOpacity onPress={() => onOptionsPress?.(pet)} style={styles.icon}>
        <Feather name="more-vertical" size={20} color={theme.brown} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: "#efdcab",
    borderRadius: 16,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  cardRed: {
    backgroundColor: '#ffa3a3',
  },
  image: {
    width: 100,
    height: 100,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    marginRight: 10,
    borderColor: 'white',
    borderWidth: 2,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 18,
  },
  age: {
    fontSize: 14,
    color: '#444',
  },
  icon: {
    paddingRight: 15,
  },
});

export default PetCard;
