import { TextMedium, TextRegular } from "@/components/StyledText";
import { theme } from "@/components/Themed";
import { Control, Controller, FieldErrors, FieldValues } from "react-hook-form";
import { TextInput } from "react-native";
import { StyleSheet } from 'react-native';

type DefaultFormFieldType = {
    control: Control<FieldValues, any, FieldValues>;
    errors: FieldErrors<FieldValues>;
    keyboardType?: 'default' | 'email-address' | 'numeric';
    label: string;
    controllerName: string;
    errorText: string;
    placeholderText: string;
    secureTextEntry?: boolean;
}
const DefaultFormField = ({ control, errors, keyboardType = 'default', label, controllerName, errorText, placeholderText, secureTextEntry=false }: DefaultFormFieldType) => {
    return (
        <>
            <TextMedium style={styles.label}>{label}</TextMedium>
            <Controller
                control={control}
                name={controllerName}
                rules={{ required: errorText }}
                render={({ field: { onChange, value } }) => (
                <TextInput
                    style={styles.input}
                    placeholderTextColor='#999'
                    placeholder={placeholderText}
                    value={value}
                    onChangeText={onChange}
                    keyboardType={keyboardType}
                    autoCapitalize='none'
                    secureTextEntry={secureTextEntry}
                />)}
            />
            {errors[controllerName] && (
                <TextRegular style={styles.error}>{`${errors[controllerName].message}`}</TextRegular>
            )}
        </>
    );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    marginBottom: 4,
    color: theme.brown,
  },
  input: {
    height: 50,
    borderColor: theme.brown,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: "#f5f5f5",
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    // Android shadow
    elevation: 5,
  },
  error: {
    color: 'red',
    marginBottom: 12,
    marginTop: -12,
    fontSize: 12,
  }
});

export default DefaultFormField;