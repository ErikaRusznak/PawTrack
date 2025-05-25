import { useForm, Controller } from 'react-hook-form';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { TextMedium } from '@/components/StyledText';
import DefaultFormField from '@/components/moleculas/form/DefaultFormField';
import { getTheme } from '@/components/Themed';
import DropDownPicker from 'react-native-dropdown-picker';
import { useState } from 'react';
import { Task } from '@/src/Task';
import { Pet } from '@/src/Pets';
import CustomDateTimePicker from '@/components/moleculas/form/CustomDateTimePicker';

const taskTitles = [
    { label: 'Vet appointment', value: 'Vet appointment' },
    { label: 'Give medication', value: 'Give medication' },
    { label: 'Take on a walk', value: 'Take on a walk' },
    { label: 'Vaccination', value: 'Vaccination' },
    { label: 'Grooming', value: 'Grooming' },
    { label: 'Feed', value: 'Feed' },
    { label: 'Training', value: 'Training' },
    { label: 'Playtime', value: 'Playtime' },
    { label: 'Other', value: 'Other' },
];

type TaskFormProps = {
    onSubmit: (data: any) => Promise<void>;
    pets: Pet[] | [];
};

const TaskForm = ({ onSubmit, pets }: TaskFormProps) => {
    const { control, handleSubmit, formState: { errors }, setValue, reset } = useForm<any>();
    const theme = getTheme();
    const [taskDropdownOpen, setTaskDropdownOpen] = useState(false);
    const [taskDropdownValue, setTaskDropdownValue] = useState(null);
    const [petDropdownOpen, setPetDropdownOpen] = useState(false);
    const [petDropdownValue, setPetDropdownValue] = useState(null);
    const [date, setDate] = useState<Date | null>(null);
    const [showCustomPicker, setShowCustomPicker] = useState(false);

    const petItems = pets.map((pet) => ({ label: pet.name, value: pet.id }));

    const onSubmitHandler = async (data: any) => {
        await onSubmit({
            ...data,
            taskDate: date ? date.toISOString() : '',
        });
        reset();
        setDate(null);
        setTaskDropdownValue(null);
        setPetDropdownValue(null);
    };

    return (
        <View>
            <TextMedium style={styles.label}>Task</TextMedium>
            <Controller
                control={control}
                name="taskTitle"
                rules={{ required: 'Task is required' }}
                render={({ field: { onChange, value } }) => (
                    <DropDownPicker
                        open={taskDropdownOpen}
                        value={taskDropdownValue}
                        items={taskTitles}
                        setOpen={setTaskDropdownOpen}
                        setValue={(cb) => {
                            const val = cb(taskDropdownValue);
                            onChange(val);
                            setTaskDropdownValue(val);
                        }}
                        placeholder="Select Task"
                        style={styles.dropdown}
                        placeholderStyle={{ fontFamily: 'Montserrat-Regular', color: '#999' }}
                        textStyle={{ fontFamily: 'Montserrat-Regular', color: theme.brown }}
                        labelStyle={{ fontFamily: 'Montserrat-Regular', color: theme.brown }}
                        containerStyle={{ marginBottom: 16 }}
                    />
                )}
            />
            {errors.taskTitle && (
                <TextMedium style={styles.error}>{errors.taskTitle.message as string}</TextMedium>
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

            <TextMedium style={styles.label}>Date</TextMedium>
            <TouchableOpacity
                onPress={() => setShowCustomPicker(true)}
                style={[
                    styles.dropdown,
                    { justifyContent: 'center', height: 50, borderWidth: 1, borderColor: '#443627', backgroundColor: '#fff', marginBottom: 16, },
                    
                ]}
            >
                <TextMedium style={{ color: date ? theme.brown : '#999', fontFamily: 'Montserrat-Regular' }}>
                    {date ? date.toLocaleString() : 'Select date & time'}
                </TextMedium>
            </TouchableOpacity>
            <Controller
                control={control}
                name="taskDate"
                rules={{ required: 'Date is required' }}
                render={() => <></>}
            />
            {errors.taskDate && (
                <TextMedium style={[styles.error, { marginTop: -8 }]}>{errors.taskDate.message as string}</TextMedium>
            )}
            <CustomDateTimePicker
                value={date}
                onChange={d => { setDate(d); setValue('taskDate', d.toISOString()); }}
                visible={showCustomPicker}
                onClose={() => setShowCustomPicker(false)}
                theme={theme}
            />
            <DefaultFormField
                control={control}
                errors={errors}
                label="Details"
                controllerName="details"
                errorText="Details are required"
                placeholderText="Details...."
                style={styles.textarea}
            />

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 24 }}>
                <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => reset()}>
                    <TextMedium style={[styles.buttonText, { color: theme.brown }]}>Cancel</TextMedium>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.submitButton]} onPress={handleSubmit(onSubmitHandler)}>
                    <TextMedium style={[styles.buttonText, { color: theme.yellow }]}>Submit</TextMedium>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    label: { color: '#443627', marginBottom: 4, },
    dropdown: {
        borderColor: '#443627',
        borderRadius: 8,
        paddingHorizontal: 16,
        marginBottom: 8,
        backgroundColor: '#fff',
        zIndex: 999
    },
    textarea: {
        height: 80,
        textAlignVertical: 'top',
        backgroundColor: '#fff',
    },
    error: {
        color: 'red',
        fontSize: 12,
        marginBottom: 16,
        marginTop: -16,
    },
    button: {
        flex: 1,
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    cancelButton: {
        backgroundColor: '#efdcab',
    },
    submitButton: {
        backgroundColor: '#d98324',
    },
    buttonText: {
        fontSize: 16,
        fontFamily: 'Montserrat-Regular',
    },
});

export default TaskForm;
