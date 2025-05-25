import { SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';
import { getTheme, View } from '@/components/Themed';
import { useSession } from '@/context/AuthContext';
import { Controller, useForm } from "react-hook-form";
import TitleAuthScreen from "@/components/atoms/authentication/TitleAuthScreen";
import DefaultFormField from "@/components/moleculas/form/DefaultFormField";
import { TextMedium, TextRegular } from "@/components/StyledText";
import { router } from "expo-router";
import ImageUploader from "@/components/moleculas/form/ImageUploader";
import { useState } from 'react';
import { storage } from '@/firebase/firebaseConfig';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import uuid from 'react-native-uuid';
import DropDownPicker from "react-native-dropdown-picker";
import { ROMANIAN_COUNTIES } from "@/constants/Counties";

type RegisterData = {
  firstName: string;
  lastName: string;
  age: number;
  county: string;
  email: string;
  password: string;
  picture?: string;
};

const SignUpScreen = () => {
  const { signUp } = useSession();
  const { control, handleSubmit, formState: { errors } } = useForm();
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [countyDropdownOpen, setCountyDropdownOpen] = useState(false);
  const [countyDropdownValue, setCountyDropdownValue] = useState(null);
  const theme = getTheme();
  const [resetKey, setResetKey] = useState(0);
  const counties = ROMANIAN_COUNTIES.map((county) => ({ label: county, value: county }))

  const handleRegister = async (data: RegisterData) => {
    try {
      let pictureUrl;

      if (selectedImageUri) {
        const response = await fetch(selectedImageUri);
        const blob = await response.blob();
        const fileRef = ref(storage, `profilePictures/${uuid.v4()}.jpg`);
        await uploadBytes(fileRef, blob);
        pictureUrl = await getDownloadURL(fileRef);
      }

      return await signUp(data.firstName, data.lastName, Number(data.age), data.county, data.email, data.password, pictureUrl ?? null);
    } catch (err) {
      console.log("Error: ", err);
      return null;
    }
  }

  const onSubmit = async (data) => {
    if (data) {
      const response = await handleRegister(data);
      if (response) {
        setResetKey((k) => k + 1);
        router.replace("/sign-in");
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* <ScrollView> */}
      <TitleAuthScreen />
      <View style={styles.formContainer}>
        <View style={styles.row}>
          <View style={styles.customInput}>
            <DefaultFormField
              control={control}
              errors={errors}
              label='First Name'
              controllerName='firstName'
              errorText='First name is required'
              placeholderText='First Name...'
              style={{ width: 150 }}
            />
          </View>
          <View style={styles.customInput}>
            <DefaultFormField
              control={control}
              errors={errors}
              label='Last Name'
              controllerName='lastName'
              errorText='Last name is required'
              placeholderText='Last Name...'
              style={{ width: 150 }}
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.customInput}>
            <DefaultFormField
              control={control}
              errors={errors}
              keyboardType='numeric'
              label='Age'
              controllerName='age'
              errorText='Age is required'
              placeholderText='Age...'
              style={{ width: 150 }}
            />
          </View>
          <View style={styles.customInput}>
            <TextMedium style={styles.label}>County</TextMedium>
            <Controller
              control={control}
              name="petId"
              rules={{ required: 'County is required' }}
              render={({ field: { onChange, value } }) => (
                <DropDownPicker
                  open={countyDropdownOpen}
                  value={countyDropdownValue}
                  items={counties}
                  setOpen={setCountyDropdownOpen}
                  setValue={(cb) => {
                    const val = cb(countyDropdownValue);
                    onChange(val);
                    setCountyDropdownValue(val);
                  }}
                  placeholder="Select County"
                  style={styles.dropdown}
                  placeholderStyle={{ fontFamily: 'Montserrat-Regular', color: '#999' }}
                  textStyle={{ fontFamily: 'Montserrat-Regular', color: theme.brown }}
                  labelStyle={{ fontFamily: 'Montserrat-Regular', color: theme.brown }}
                  containerStyle={{ marginBottom: 16 }}
                />
              )}
            />
            {errors.petId && (
              <TextMedium style={styles.error}>{errors.petId.message as string}</TextMedium>
            )}

          </View>
        </View>

        <DefaultFormField
          control={control}
          errors={errors}
          keyboardType='email-address'
          label='Email'
          controllerName='email'
          errorText='Email is required'
          placeholderText='Email...'
        />
        <DefaultFormField
          control={control}
          errors={errors}
          label='Password'
          controllerName='password'
          errorText='Password is required'
          placeholderText='Password...'
          secureTextEntry={true}
        />

        <ImageUploader onImageSelected={(uri) => setSelectedImageUri(uri)} resetKey={resetKey}/>

        <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
          <TextMedium style={styles.buttonText}>Register</TextMedium>
        </TouchableOpacity>

        <TextRegular style={styles.bottomText}>
          Already have an account?{' '}
          <TextMedium style={styles.link} onPress={() => router.replace('/sign-in')}>
            Sign in here
          </TextMedium>
        </TextRegular>
      </View>
      {/* </ScrollView> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    marginBottom: 4,
    color: "#443627",
  },
  dropdown: {
    borderColor: '#443627',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 8,
    backgroundColor: '#fff',
    zIndex: 999,
    width: 150
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginBottom: 16,
    marginTop: -16,
  },
  row: {
    flexDirection: 'row',
    gap: 2,
    justifyContent: 'space-between',
    backgroundColor: "#efdcab",
  },
  customInput: {
    backgroundColor: "#efdcab",
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: "#efdcab",
  },
  formContainer: {
    alignSelf: 'center',
    width: '80%',
    backgroundColor: "#efdcab",
  },
  button: {
    backgroundColor: "#d98324",
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: "#f2f6d0",
  },
  bottomText: {
    marginTop: 24,
    textAlign: 'center',
    color: "#443627",
  },
  link: {
    color: "#d98324",
  },
});

export default SignUpScreen;
