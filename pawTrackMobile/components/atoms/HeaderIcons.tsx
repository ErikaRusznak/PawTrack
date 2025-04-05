import { AntDesign, FontAwesome, Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Pressable } from "react-native";
import { theme } from "../Themed";


const HeaderIcons = () => {
    return (
        <>
            <Link href="../searchVet" asChild>
                <Pressable>
                    {({ pressed }) => (
                        <AntDesign name="search1" size={25} color={theme.brown} style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }} />
                    )}
                </Pressable>
            </Link>
            <Link href="../addTask" asChild>
                <Pressable>
                    {({ pressed }) => (
                        <Ionicons name="add-circle-outline" size={28} color={theme.brown} style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }} />
                    )}
                </Pressable>
            </Link>
        </>
    );
};

export default HeaderIcons;