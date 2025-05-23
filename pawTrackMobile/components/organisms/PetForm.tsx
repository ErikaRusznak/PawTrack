import { useForm, Controller } from 'react-hook-form';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { TextMedium } from '@/components/StyledText';
import DefaultFormField from '@/components/moleculas/form/DefaultFormField';
import { getTheme } from '@/components/Themed';
import * as ImagePicker from 'expo-image-picker';
import DropDownPicker from 'react-native-dropdown-picker';
import { useState } from 'react';
import { Pet } from '@/src/Pets';

type PetFormProps = {
  defaultValues?: any;
  onSubmit: (data: Pet, uri: string) => Promise<void>;
  buttonText: string;
};

const animalTypes = [
  { label: "Cat", value: "Cat" },
  { label: "Dog", value: "Dog" },
  { label: "Fish", value: "Fish" },
  { label: "Horse", value: "Horse" },
  { label: "Hamster", value: "Hamster" },
  { label: "Other", value: "other" },
];

const PetForm = ({ onSubmit, buttonText }: PetFormProps) => {

  const { control, handleSubmit, formState: { errors }, setValue, reset } = useForm<any>();
  const theme = getTheme();
  const [image, setImage] = useState<any>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownValue, setDropdownValue] = useState(null);

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
    await onSubmit(data, image);
    reset();
    if (buttonText === 'Submit') setImage(null);
  };


  return (
    <View>
      <TouchableOpacity
        onPress={pickImage}
        style={[
          styles.imagePicker,
          { borderColor: image ? "white" : theme.brown }
        ]}>
        {image ?
          <Image source={{ uri: image }} style={styles.image} /> : <TextMedium>Add Image</TextMedium>
        }
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
        <TextMedium style={styles.submitText}>{buttonText}</TextMedium>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20
  },
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

export default PetForm;
