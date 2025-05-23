import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text, theme, View } from '@/components/Themed';
import MainView from '@/components/templates/MainView';
import PetCard from '@/components/moleculas/pets/PetCard';
import { TextMedium } from '@/components/StyledText';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { deletePet, getPets, Pet, updatePetFoundStatus } from '@/src/Pets';
import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import Pagination from '@/components/atoms/Pagination';
import PetActionsPopup from '@/components/moleculas/pets/PetActionsPopup';

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

  useEffect(() => {
    (async () => {
      const { pets: initialPets, lastDoc } = await getPets();
      setPets(initialPets);
      setLastDocs([lastDoc!]);
    })();
  }, [pets]);


  // pop up
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [popupVisible, setPopupVisible] = useState(false);

  const handleOptions = (pet: Pet) => {
    setSelectedPet(pet);
    setPopupVisible(true);
  };

  const handleMarkAsFound = async (petId: string) => {
    await updatePetFoundStatus(petId, true);
    const { pets: updatedPets } = await getPets(lastDocs[currentPage - 1]);
    setPets(updatedPets);
  };

  const handleDelete = async (petId: string) => {
    await deletePet(petId);
    const { pets: updatedPets } = await getPets(lastDocs[currentPage - 1]);
    setPets(updatedPets);
  };

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
            <PetCard key={pet.id} pet={pet} onOptionsPress={() => handleOptions(pet)} />
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

      {selectedPet && (
        <PetActionsPopup
          visible={popupVisible}
          onClose={() => setPopupVisible(false)}
          pet={selectedPet!}
          onMarkAsFound={handleMarkAsFound}
          onDelete={handleDelete}
        />
      )}
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
    backgroundColor: "#d98324",
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
    borderColor: "#443627",
  },
  addPetText: {
    color: "#f2f6d0",
    fontSize: 24,
  },
});

export default PetsScreen;