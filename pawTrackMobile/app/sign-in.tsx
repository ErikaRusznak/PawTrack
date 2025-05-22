import { StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { theme, View } from '@/components/Themed';
import { useSession } from '@/context/AuthContext';
import { useForm } from 'react-hook-form';
import { router } from 'expo-router';
import { TextMedium, TextRegular } from '@/components/StyledText';
import TitleAuthScreen from '@/components/atoms/authentication/TitleAuthScreen';
import DefaultFormField from '@/components/moleculas/form/DefaultFormField';

type LoginData = {
  email: string;
  password: string;
}

const SignInScreen = () => {

  const { signIn } = useSession();
  const { control, handleSubmit, formState: { errors } } = useForm();
  
  const handleLogin = async (data: LoginData) => {
    try {
      return await signIn(data.email, data.password);
    } catch (err) {
      console.log("[handleLogin] ==>", err);
      return null;
    }
  }
  const onSubmit = async (data) => {
    if(data) {
      const response = await handleLogin(data);
      if(response) {
        router.replace("./(tabs)")
      }
    }
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
                <TextMedium style={styles.link} onPress={() => router.replace('/sign-up')}>
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
    backgroundColor: "#efdcab",
  },
  formContainer: {
    alignSelf: 'center',
    width: '80%',
    backgroundColor: "#efdcab",
  },
  button: {
    backgroundColor: "#efdcab",
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

export default SignInScreen;
