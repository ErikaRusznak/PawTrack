import { FontAwesome } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Pressable } from "react-native";
import { theme } from "../Themed";

const HeaderIcons = () => {

    return (
        <>
        <Link href="/modal" asChild>
            <Pressable>
                {({ pressed }) => (
                    <FontAwesome name="info-circle" size={25} color={theme.text} style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }} />
                )}
            </Pressable>
        </Link>
        <Link href="../addTask" asChild>
            <Pressable>
                {({ pressed }) => (
                    <FontAwesome name="info-circle" size={25} color={theme.text} style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }} />
                )}
            </Pressable>
        </Link>
        </>
    );
};

export default HeaderIcons;