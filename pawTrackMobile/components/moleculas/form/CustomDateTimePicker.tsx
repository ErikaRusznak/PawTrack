import CustomCalendar from '@/components/atoms/CustomCalendar';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import DropDownPicker from 'react-native-dropdown-picker';

type Props = {
    value: Date | null;
    onChange: (date: Date) => void;
    visible: boolean;
    onClose: () => void;
    theme: any;
};

const hours = Array.from({ length: 24 }, (_, i) => i);
const minutes = Array.from({ length: 60 }, (_, i) => i);

const CustomDateTimePicker = ({ value, onChange, visible, onClose, theme }: Props) => {
    const [selectedDate, setSelectedDate] = useState(value || new Date());
    const [showTime, setShowTime] = useState(false);
    const [selectedHour, setSelectedHour] = useState(value ? value.getHours() : 12);
    const [selectedMinute, setSelectedMinute] = useState(value ? value.getMinutes() : 0);
    const [hourOpen, setHourOpen] = useState(false);
    const [minuteOpen, setMinuteOpen] = useState(false);
    const hourItems = hours.map(h => ({ label: h.toString().padStart(2, '0'), value: h }));
    const minuteItems = minutes.filter(m => m % 5 === 0).map(m => ({ label: m.toString().padStart(2, '0'), value: m }));

    const handleDateSelect = (day: any) => {
        const date = new Date(day.dateString);
        setSelectedDate(date);
        setShowTime(true);
    };

    const handleTimeSelect = () => {
        const date = new Date(selectedDate);
        date.setHours(selectedHour);
        date.setMinutes(selectedMinute);
        date.setSeconds(0);
        onChange(date);
        setShowTime(false);
        onClose();
    };

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <View style={styles.modalBackground}>
                <View style={[styles.modalContent, { backgroundColor: theme.white }]}>
                    {!showTime ? (
                        <>
                            <Text style={[styles.title, { color: theme.brown }]}>Select Date</Text>
                            <CustomCalendar 
                                handleDateSelect={handleDateSelect}
                                selectedDate={selectedDate}
                            />
                            <TouchableOpacity onPress={onClose} style={styles.cancelBtn}>
                                <Text style={{ color: theme.brown }}>Cancel</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>
                            <Text style={[styles.title, { color: theme.brown }]}>Select Time</Text>
                            <View style={styles.timeRow}>
                                <Text style={{ color: theme.brown, marginRight: 8 }}>Hour:</Text>
                                <DropDownPicker
                                    open={hourOpen}
                                    value={selectedHour}
                                    items={hourItems}
                                    setOpen={setHourOpen}
                                    setValue={setSelectedHour}
                                    setItems={() => { }}
                                    style={{ width: 80, backgroundColor: theme.white, borderColor: theme.brown, zIndex: 1000 }}
                                    textStyle={{ color: theme.brown }}
                                    containerStyle={{ width: 80 }}
                                    dropDownContainerStyle={{ backgroundColor: theme.white, borderColor: theme.brown, zIndex: 1000 }}
                                />
                            </View>
                            <View style={styles.timeRow}>
                                <Text style={{ color: theme.brown, marginRight: 8 }}>Minute:</Text>
                                <DropDownPicker
                                    open={minuteOpen}
                                    value={selectedMinute}
                                    items={minuteItems}
                                    setOpen={setMinuteOpen}
                                    setValue={setSelectedMinute}
                                    setItems={() => { }}
                                    style={{ width: 80, backgroundColor: theme.white, borderColor: theme.brown, zIndex: 999 }}
                                    textStyle={{ color: theme.brown }}
                                    containerStyle={{ width: 80 }}
                                    dropDownContainerStyle={{ backgroundColor: theme.white, borderColor: theme.brown, zIndex: 999 }}
                                />
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16, gap: 120 }}>
                                <TouchableOpacity onPress={() => setShowTime(false)} style={styles.cancelBtn}>
                                    <Text style={{ color: theme.brown }}>Back</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={handleTimeSelect} style={styles.okBtn}>
                                    <Text style={{ color: theme.yellow }}>Accept</Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    )}
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalContent: {
        width: '90%',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center'
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12
    },
    timeRow: {
        display: "flex",
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
        justifyContent: "flex-end"
    },
    cancelBtn: {
        backgroundColor: '#efdcab',
        paddingHorizontal: 20,
        paddingVertical: 8, 
        borderRadius: 8,
    },
    okBtn: {
        backgroundColor: '#d98324',
        paddingHorizontal: 20,
        paddingVertical: 8, 
        borderRadius: 8,
    }
});

export default CustomDateTimePicker;