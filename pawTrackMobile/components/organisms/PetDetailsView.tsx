import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { getTheme } from "@/components/Themed";
import { useCallback, useEffect, useState } from "react";
import { getPetById } from "@/src/Pets";
import { getTasksByPetId } from "@/src/Task";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import Paginator from "@/components/atoms/Paginator";

const PetDetailsView = () => {
    const { id } = useLocalSearchParams();
    const theme = getTheme();
    const [petData, setPetData] = useState<any>(null);
    const [tasks, setTasks] = useState<any[]>([]);
    const [petLoading, setPetLoading] = useState(true);
    const [tasksLoading, setTasksLoading] = useState(true);

    const ITEMS_PER_PAGE = 3;

    const [vaccinationPage, setVaccinationPage] = useState(0);
    const [appointmentPage, setAppointmentPage] = useState(0);

    const loadPetAndTasks = async () => {
        setPetLoading(true);
        setTasksLoading(true);

        const petContent = await getPetById(id as string);
        if (!petContent) return;

        setPetData(petContent);
        setPetLoading(false);

        const taskList = await getTasksByPetId(id as string);
        setTasks(taskList);
        setTasksLoading(false);
    };

    useFocusEffect(
        useCallback(() => {
            loadPetAndTasks();
        }, [id])
    );

    if (!petData) return null;

    const vaccinations = tasks.filter((t) => t.taskTitle === 'Vaccination');
    const appointments = tasks.filter((t) => t.taskTitle === 'Vet appointment');

    const renderStatusIcon = (dateStr: string, completed: boolean) => {
        if (completed) {
            return <MaterialIcons name="check-circle" size={20} color="#4CAF50" />;
        }
        const now = new Date();
        const date = new Date(dateStr);
        if (date > now) {
            return <MaterialIcons name="schedule" size={20} color="#A67C00" />;
        } else if (date == now) {
            return <MaterialIcons name="error" size={20} color="#2196F3" />;
        } else {
            return <MaterialIcons name="cancel" size={20} color="#F44336" />;
        }
    };

    const paginate = (items: any[], page: number) => {
        const start = page * ITEMS_PER_PAGE;
        return items.slice(start, start + ITEMS_PER_PAGE);
    };


    return (
        <ScrollView>
            <View style={styles.profileSection}>
                <View style={{ position: 'relative' }}>
                    {petLoading && (
                        <View style={[styles.profileImage, styles.imageLoader]}>
                            <Text>Loading...</Text>
                        </View>
                    )}
                    <Image
                        source={{ uri: petData.picture }}
                        style={[styles.profileImage, petLoading ? { opacity: 0 } : { opacity: 1 }]}
                        onLoadEnd={() => setPetLoading(false)}
                    />
                </View>
                <View style={styles.profileTextContainer}>
                    <Text style={styles.petName}>{petData.name}</Text>
                    <Text style={styles.petInfo}>
                        {petData.animalType}, {petData.age} years old
                    </Text>
                    <Text style={styles.petDetails}>{petData.details}</Text>
                </View>
            </View>

            {tasksLoading ? (
                <Text style={{ textAlign: 'center', marginVertical: 24 }}>Loading tasks...</Text>
            ) : (
                <>
                    <View>
                        <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 8, color: theme.brown }}>
                            <FontAwesome name="medkit" size={16} /> Vaccinations
                        </Text>
                        {vaccinations.length === 0 ? (
                            <Text style={{ textAlign: 'center', marginTop: 12, color: '#999' }}>
                                No vaccinations found.
                            </Text>
                        ) : (
                            <>
                                {paginate(vaccinations, vaccinationPage).map((v, i) => (
                                    <View
                                        key={i}
                                        style={{
                                            backgroundColor: theme.beige,
                                            borderRadius: 12,
                                            padding: 12,
                                            marginBottom: 8,
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <View>
                                            <Text style={{ fontWeight: '600', color: theme.brown }}>{v.details}</Text>
                                            <Text
                                                style={{ color: theme.brown }}>{new Date(v.taskDate.toDate()).toLocaleString()}</Text>
                                        </View>
                                        {renderStatusIcon(v.taskDate.toDate(), v.completed)}
                                    </View>
                                ))}
                                {vaccinations.length > 3 && (
                                    <Paginator page={vaccinationPage}
                                        totalItems={vaccinations.length}
                                        itemsPerPage={ITEMS_PER_PAGE}
                                        onPageChange={setVaccinationPage}
                                    />
                                )}
                            </>
                        )}
                    </View>

                    <View style={{ marginTop: 24 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 8, color: theme.brown }}>
                            <FontAwesome name="user-md" size={16} /> Vet Appointments
                        </Text>
                        {appointments.length === 0 ? (
                            <Text style={{ textAlign: 'center', marginTop: 12, color: '#999' }}>
                                No appointments found.
                            </Text>
                        ) : (
                            <>
                                {paginate(appointments, appointmentPage).map((v, i) => (
                                    <View
                                        key={i}
                                        style={{
                                            backgroundColor: theme.beige,
                                            borderRadius: 12,
                                            padding: 12,
                                            marginBottom: 8,
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <View>
                                            <Text style={{ fontWeight: '600', color: theme.brown }}>{v.details}</Text>
                                            <Text
                                                style={{ color: theme.brown }}>{new Date(v.taskDate.toDate()).toLocaleString()}</Text>
                                        </View>
                                        {renderStatusIcon(v.taskDate.toDate(), v.completed)}
                                    </View>
                                ))}
                                {appointments.length > 3 && (<Paginator
                                    page={appointmentPage}
                                    totalItems={appointments.length}
                                    itemsPerPage={ITEMS_PER_PAGE}
                                    onPageChange={setAppointmentPage}
                                />)}
                            </>
                        )}
                    </View>
                </>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 32,
    },
    imageLoader: {
        position: 'absolute',
        top: 0,
        left: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f2f2f2',
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginRight: 16,
    },
    profileTextContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    petName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#443627'
    },
    petInfo: {
        fontSize: 16,
        marginBottom: 4,
        color: '#443627'
    },
    petDetails: {
        fontSize: 14,
        color: '#443627',
        textAlign: 'justify'
    },

});

export default PetDetailsView