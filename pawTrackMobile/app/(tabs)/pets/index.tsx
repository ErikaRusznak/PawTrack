import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text, theme, View } from '@/components/Themed';
import MainView from '@/components/templates/MainView';
import PetCard from '@/components/moleculas/pets/PetCard';
import { TextMedium } from '@/components/StyledText';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { getPets, Pet } from '@/src/Pets';
import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import Pagination from '@/components/atoms/Pagination';

const PetsScreen = () => {

  const router = useRouter();
  const addPet = () => {
    router.replace("/(tabs)/pets/add");
  };

  const [pets, setPets] = useState<Pet[]>([]);
  const [lastDocs, setLastDocs] = useState<QueryDocumentSnapshot<DocumentData>[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);

  const loadPets = async (direction: 'next' | 'previous') => {
    let page = currentPage;
    let cursor: QueryDocumentSnapshot<DocumentData> | undefined;

    if (direction === 'next') {
      cursor = lastDocs[page - 1];
      page += 1;
    } else if (direction === 'previous') {
      page -= 1;
      cursor = page === 1 ? undefined : lastDocs[page - 2];
    }

    const { pets: newPets, lastDoc, hasMore } = await getPets(cursor);
    
    setPets(newPets);
    setHasNextPage(hasMore);
    if (direction === 'next') {
      setLastDocs((prev) => {
        const updated = [...prev];
        updated[page - 1] = lastDoc!;
        return updated;
      });
    }
    setCurrentPage(page);
  };


  useEffect(() => {
    (async () => {
      const { pets: initialPets, lastDoc } = await getPets();
      setPets(initialPets);
      setLastDocs([lastDoc!]);
    })();
  }, []);

  return (
    <MainView>
      <View style={styles.screen}>
        <View style={styles.filterAndAdd}>
          <TextMedium></TextMedium>
          <TouchableOpacity onPress={addPet} style={styles.addPetButton}>
            <TextMedium style={styles.addPetText}>Add pet</TextMedium>
          </TouchableOpacity>
        </View>
        <View style={styles.petCards}>
          {pets.map((pet) => (
            <PetCard key={pet.id} pet={pet} /*onOptionsPress={() => handleOptions(pet)}*/ />
          ))}
        </View>
        <Pagination
          currentPage={currentPage}
          onPrevious={() => loadPets('previous')}
          onNext={() => loadPets('next')}
          disablePrevious={currentPage === 1}
          disableNext={!hasNextPage}
        />
      </View>

    </MainView>
  );
};

const styles = StyleSheet.create({
  screen: {
    marginHorizontal: 20,
    marginVertical: 10,
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  filterAndAdd: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  petCards: {
    flexDirection: "column",
    gap: 20,
  },
  addPetButton: {
    backgroundColor: theme.orange,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    marginTop: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    borderWidth: 1,
    borderColor: theme.brown,
  },
  addPetText: {
    color: theme.yellow,
    fontSize: 24,
  },
});

export default PetsScreen;