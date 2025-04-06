import { AntDesign, FontAwesome, Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Pressable } from "react-native";
import { theme } from "../Themed";

type HeaderIconsProps = {
    searchSelected: boolean;
    addSelected: boolean;
}
const HeaderIcons = ({ searchSelected, addSelected }:HeaderIconsProps) => {
    return (
        <>
            <Link href="../searchVet" asChild>
                <Pressable>
                    {({ pressed }) => (
                        searchSelected ? 
                            <FontAwesome name="search" size={25} color={theme.brown} style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }} /> : 
                            <AntDesign name="search1" size={25} color={theme.brown} style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }} />
                    )}
                </Pressable>
            </Link>
            <Link href="../addTask" asChild>
                <Pressable>
                    {({ pressed }) => (
                        addSelected ? 
                            <Ionicons name="add-circle" size={28} color={theme.brown} style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }} /> :
                            <Ionicons name="add-circle-outline" size={28} color={theme.brown} style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }} /> 
                    )}
                </Pressable>
            </Link>
        </>
    );
};

export default HeaderIcons;