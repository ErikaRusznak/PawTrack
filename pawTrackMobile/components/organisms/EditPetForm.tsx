import { useForm, Controller } from 'react-hook-form';
import {View, StyleSheet, TouchableOpacity, Image, ActivityIndicator} from 'react-native';
import { TextMedium } from '@/components/StyledText';
import DefaultFormField from '@/components/moleculas/form/DefaultFormField';
import * as ImagePicker from 'expo-image-picker';
import DropDownPicker from 'react-native-dropdown-picker';
import { useEffect, useState } from 'react';
import { Pet, getPetById, updatePet } from '@/src/Pets';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import { storage } from '@/firebase/firebaseConfig';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import uuid from 'react-native-uuid';
import { getTheme } from '../Themed';

const animalTypes = [
  { label: "Cat", value: "Cat" },
  { label: "Dog", value: "Dog" },
  { label: "Fish", value: "Fish" },
  { label: "Horse", value: "Horse" },
  { label: "Hamster", value: "Hamster" },
  { label: "Other", value: "other" },
];

const EditPetForm = () => {
  const theme = getTheme();
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [image, setImage] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownValue, setDropdownValue] = useState<string | null>(null);
  const [pictureLoading, setPictureLoading] = useState(false);
  const { control, handleSubmit, setValue, formState: { errors }, reset } = useForm<any>();

  const loadPet = async () => {
    try {
      const pet = await getPetById(id as string);
      if (pet) {
        const prepared = {
          ...pet,
          age: String(pet.age),
        };
        reset(prepared);
        setImage(pet.picture || null);
        setDropdownValue(pet.animalType || null);
      }
    } catch (e) {
      Toast.show({ type: 'error', text1: 'Failed to load pet data' });
      console.error(e);
    }
  };

  useEffect(() => {
    loadPet();
  }, [id]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      if (uri !== image) {
        setImage(uri);
        setValue("picture", uri);
      }
    }
  };

  const onSubmitHandler = async (data: Pet) => {
    try {
      let pictureUrl = data.picture;

      if (image && image !== data.picture) {
        setPictureLoading(true);

        const response = await fetch(image);
        const blob = await response.blob();

        const fileRef = ref(storage, `petPictures/${uuid.v4()}.jpg`);
        await uploadBytes(fileRef, blob);

        pictureUrl = await getDownloadURL(fileRef);
        setPictureLoading(false);
      }

      await updatePet(id as string, {
        ...data,
        picture: pictureUrl,
        age: Number(data.age),
      });

      Toast.show({ type: 'success', text1: 'Pet updated!' });
      router.replace("/(tabs)/pets");
    } catch (err) {
      setPictureLoading(false);
      Toast.show({ type: 'error', text1: 'Update failed' });
      console.error(err);
    }
  };



  return (
    <View>
      <TouchableOpacity
          onPress={pickImage}
          style={[
            styles.imagePicker,
            { borderColor: image ? "white" : theme.brown }
          ]}
          disabled={pictureLoading}
      >
        {pictureLoading ? (
            <ActivityIndicator size="small" color={theme.brown} />
        ) : image ? (
            <Image source={{ uri: image }} style={styles.image} />
        ) : (
            <TextMedium>Add Image</TextMedium>
        )}
      </TouchableOpacity>



      <DefaultFormField
        control={control}
        errors={errors}
        label="Name"
        controllerName="name"
        errorText="Name is required"
        placeholderText="Name..."
        style={styles.input}
      />

      <DefaultFormField
        control={control}
        errors={errors}
        label="Age"
        keyboardType="numeric"
        controllerName="age"
        errorText="Age is required"
        placeholderText="Age..."
        style={styles.input}
      />

      <TextMedium style={styles.label}>Animal Type</TextMedium>
      <Controller
        control={control}
        name="animalType"
        rules={{ required: "Animal type is required" }}
        render={({ field: { onChange, value } }) => (
          <DropDownPicker
            open={dropdownOpen}
            value={dropdownValue}
            items={animalTypes}
            setOpen={setDropdownOpen}
            setValue={(cb) => {
              const val = cb(dropdownValue);
              onChange(val);
              setDropdownValue(val);
            }}
            placeholder="Select Animal type"
            style={styles.dropdown}
            placeholderStyle={{ fontFamily: 'Montserrat-Regular', color: '#999' }}
            textStyle={{ fontFamily: 'Montserrat-Regular', color: theme.brown }}
            labelStyle={{ fontFamily: 'Montserrat-Regular', color: theme.brown }}
            containerStyle={{ marginBottom: 16 }}
          />
        )}
      />
      {errors.animalType && (
        <TextMedium style={styles.error}>{errors.animalType.message as string}</TextMedium>
      )}

      <DefaultFormField
        control={control}
        errors={errors}
        label="Details"
        controllerName="details"
        errorText="Details are required"
        placeholderText="Details..."
        style={styles.textarea}
      />

      <TouchableOpacity
        onPress={handleSubmit(onSubmitHandler)}
        style={styles.submit}
      >
        <TextMedium style={styles.submitText}>Update</TextMedium>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  imagePicker: {
    alignSelf: "center",
    borderRadius: 100,
    borderWidth: 2,
    width: 120,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    overflow: "hidden"
  },
  image: { width: 120, height: 120, borderRadius: 100 },
  label: { color: "#443627", marginBottom: 4 },
  dropdown: {
    borderColor: "#443627",
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  textarea: {
    height: 80,
    textAlignVertical: "top",
    backgroundColor: "#fff",
  },
  error: {
    color: "red",
    fontSize: 12,
    marginBottom: 12,
  },
  submit: {
    backgroundColor: "#d98324",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  submitText: {
    color: "#f2f6d0"
  },
  input: {
    backgroundColor: "#fff"
  }
});

export default EditPetForm;
