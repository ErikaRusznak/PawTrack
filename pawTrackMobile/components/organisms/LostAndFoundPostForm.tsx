import { useForm, Controller } from 'react-hook-form';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { TextMedium } from '@/components/StyledText';
import DefaultFormField from '@/components/moleculas/form/DefaultFormField';
import { getTheme } from '@/components/Themed';
import * as ImagePicker from 'expo-image-picker';
import DropDownPicker from 'react-native-dropdown-picker';
import { useState } from 'react';
import { Pet, updatePetFoundStatus } from '@/src/Pets';
import { ROMANIAN_COUNTIES } from '@/constants/Counties';
import ImageUploader from '../moleculas/form/ImageUploader';
import uuid from 'react-native-uuid';
import { storage } from '@/firebase/firebaseConfig';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addPost, Post } from '@/src/LostAndFoundPost';
import Toast from 'react-native-toast-message';
import { router } from 'expo-router';
import { getUserProfile } from '@/src/User';
import { removeDiacritics } from '@/util/HelperFunctions';

type LostAndFoundPostFormProps = {
    buttonText: string;
    pets: Pet[] | [];
};

const LostAndFoundPostForm = ({ buttonText, pets }: LostAndFoundPostFormProps) => {

    const { control, handleSubmit, formState: { errors }, setValue, reset } = useForm<any>();
    const theme = getTheme();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [dropdownValue, setDropdownValue] = useState(null);
    const counties = ROMANIAN_COUNTIES.map((county) => ({ label: county, value: county }));
    const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
    const [petDropdownOpen, setPetDropdownOpen] = useState(false);
    const [petDropdownValue, setPetDropdownValue] = useState(null);
    const [resetKey, setResetKey] = useState(0);

    const petItems = pets?.map((pet) => ({ label: pet.name, value: pet.id }));


    const handleAddPost = async (data: Post) => {
        try {
            let pictureUrl;

            if (selectedImageUri) {
                const response = await fetch(selectedImageUri);
                const blob = await response.blob();
                const fileRef = ref(storage, `lostAndFound/${uuid.v4()}.jpg`);
                await uploadBytes(fileRef, blob);
                pictureUrl = await getDownloadURL(fileRef);
            }
            const userId = await AsyncStorage.getItem('userId');
            if (!userId) throw new Error('User ID not found in storage');

            const profile = await getUserProfile(userId);
            if (!profile) throw new Error('User profile not found');

            const postToSave: Post = {
                ...data,
                userId: userId,
                picture: pictureUrl,
                userPicture: profile.picture,
                userFirstName: profile.firstName,
                userLastName: profile.lastName,
                county: removeDiacritics(data.county),
            };
            await updatePetFoundStatus(data.petId, false);
            await addPost(postToSave);
            Toast.show({ type: 'success', text1: 'Post added!' });
            router.replace("/(tabs)/lostAndFound");
        } catch (err) {
            Toast.show({ type: 'error', text1: 'Failed to add post' });
            console.error(err);
        }

    }
    const onSubmitHandler = async (data: Post) => {
        await handleAddPost(data);
        reset();
        setDropdownValue(null);
        setPetDropdownValue(null);
        setResetKey((k) => k + 1);
    };


    return (
        <View>
            <DefaultFormField
                control={control}
                errors={errors}
                label="Title"
                controllerName="title"
                errorText="Title is required"
                placeholderText="Title..."
                style={styles.input}
            />

            <TextMedium style={styles.label}>County</TextMedium>
            <Controller
                control={control}
                name="county"
                rules={{ required: "County is required" }}
                render={({ field: { onChange, value } }) => (
                    <DropDownPicker
                        open={dropdownOpen}
                        value={dropdownValue}
                        items={counties}
                        setOpen={setDropdownOpen}
                        setValue={(cb) => {
                            const val = cb(dropdownValue);
                            onChange(val);
                            setDropdownValue(val);
                        }}
                        placeholder="Select county"
                        style={styles.dropdown}
                        placeholderStyle={{ fontFamily: 'Montserrat-Regular', color: '#999' }}
                        textStyle={{ fontFamily: 'Montserrat-Regular', color: theme.brown }}
                        labelStyle={{ fontFamily: 'Montserrat-Regular', color: theme.brown }}
                        containerStyle={{ marginBottom: 16 }}
                    />
                )}
            />
            {errors.county && (
                <TextMedium style={styles.error}>{errors.county.message as string}</TextMedium>
            )}

            <TextMedium style={styles.label}>Pet</TextMedium>
            <Controller
                control={control}
                name="petId"
                rules={{ required: 'Pet is required' }}
                render={({ field: { onChange, value } }) => (
                    <DropDownPicker
                        open={petDropdownOpen}
                        value={petDropdownValue}
                        items={petItems}
                        setOpen={setPetDropdownOpen}
                        setValue={(cb) => {
                            const val = cb(petDropdownValue);
                            onChange(val);
                            setPetDropdownValue(val);
                        }}
                        placeholder="Select Pet"
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

            <DefaultFormField
                control={control}
                errors={errors}
                label="Details"
                controllerName="details"
                errorText="Details are required"
                placeholderText="Details..."
                style={styles.textarea}
            />

            <ImageUploader onImageSelected={(uri) => setSelectedImageUri(uri)} aspect1={16} aspect2={9} resetKey={resetKey} />

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
        zIndex: 999,
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

export default LostAndFoundPostForm;
