import {SafeAreaView, ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import { theme, View} from '@/components/Themed';
import { useSession } from '@/context/AuthContext';
import {useForm} from "react-hook-form";
import TitleAuthScreen from "@/components/atoms/authentication/TitleAuthScreen";
import DefaultFormField from "@/components/moleculas/form/DefaultFormField";
import {TextMedium, TextRegular} from "@/components/StyledText";
import {router} from "expo-router";
import ImageUploader from "@/components/moleculas/form/ImageUploader";
import { useState } from 'react';
import { storage } from '@/firebase/firebaseConfig';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import uuid from 'react-native-uuid';

type RegisterData = {
  firstName: string;
  lastName: string;
  age: number;
  county: string;
  email: string;
  password: string;
  picture?: string;
};

const SignUpScreen =()  => {
  const { signUp } = useSession();
  const { control, handleSubmit, formState: { errors } } = useForm();
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);

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
      console.log("[handleRegister] ==>", err);
      return null;
    }
  }

  const onSubmit = async (data) => {
    if(data) {
      const response = await handleRegister(data);
      if(response) {
        router.replace("/sign-in");
      }
    }
  };

  return (
      <SafeAreaView style={styles.container}>
        <ScrollView>
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
                  style={{width: 150}}
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
                  style={{width: 150}}
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
                  style={{width: 150}}
              />
            </View>
            <View style={styles.customInput}>
              <DefaultFormField
                  control={control}
                  errors={errors}
                  label='County'
                  controllerName='county'
                  errorText='County is required'
                  placeholderText='County...'
                  style={{width: 150}}
              />
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

          <ImageUploader onImageSelected={(uri) => setSelectedImageUri(uri)} />

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
        </ScrollView>
      </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    marginBottom: 4,
    color: theme.brown,
  },
  row: {
    flexDirection: 'row',
    gap: 2,
    justifyContent: 'space-between',
    backgroundColor: theme.beige,
  },
  customInput: {
    backgroundColor: theme.beige,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: theme.beige,
  },
  formContainer: {
    alignSelf: 'center',
    width: '80%',
    backgroundColor: theme.beige,
  },
  button: {
    backgroundColor: theme.orange,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: theme.yellow,
  },
  bottomText: {
    marginTop: 24,
    textAlign: 'center',
    color: theme.brown,
  },
  link: {
    color: theme.orange,
  },
});

export default SignUpScreen;
