import { StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { theme, View } from '@/components/Themed';
import { useSession } from '@/context';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { router } from 'expo-router';
import { TextMedium, TextRegular } from '@/components/StyledText';
import TitleAuthScreen from '@/components/atoms/authentication/TitleAuthScreen';
import DefaultFormField from '@/components/moleculas/form/DefaultFormField';

const SignInScreen =()  => {

  const { signIn } = useSession();
  const { control, handleSubmit, formState: { errors } } = useForm();
  const [submittedData, setSubmittedData] = useState(null);
  
  const onSubmit = (data) => {
    console.log('Submitted Data:', data);
  };

  return (
    <SafeAreaView style={styles.container}>
        <TitleAuthScreen />
        <View style={styles.formContainer}>
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

            <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
                <TextMedium style={styles.buttonText}>Login</TextMedium>
            </TouchableOpacity>

            <TextRegular style={styles.bottomText}>
                Don’t have an account?{' '}
                <TextMedium style={styles.link} onPress={() => router.push('/sign-up')}>
                Sign up here
                </TextMedium>
            </TextRegular>
        </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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

export default SignInScreen;
