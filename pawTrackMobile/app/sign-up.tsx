

import {SafeAreaView, StyleSheet, TouchableOpacity} from 'react-native';

import { theme, View} from '@/components/Themed';
import { useSession } from '@/context';
import {useForm} from "react-hook-form";
import {useState} from "react";
import TitleAuthScreen from "@/components/atoms/authentication/TitleAuthScreen";
import DefaultFormField from "@/components/moleculas/form/DefaultFormField";
import {TextMedium, TextRegular} from "@/components/StyledText";
import {router} from "expo-router";
import ImageUploader from "@/components/moleculas/form/ImageUploader";

const SignUpScreen =()  => {
  const { signUp } = useSession();
  const { control, handleSubmit, formState: { errors } } = useForm();
  const [submittedData, setSubmittedData] = useState(null);

  const onSubmit = (data) => {
    console.log('Submitted Data:', data);
  };

  return (
      <SafeAreaView style={styles.container}>
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
                  style={{width: 150, color: theme.beige}}
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

          <ImageUploader/>

          <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
            <TextMedium style={styles.buttonText}>Register</TextMedium>
          </TouchableOpacity>

          <TextRegular style={styles.bottomText}>
            Already have an account?{' '}
            <TextMedium style={styles.link} onPress={() => router.push('/sign-in')}>
              Login
            </TextMedium>
          </TextRegular>
        </View>
      </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
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
