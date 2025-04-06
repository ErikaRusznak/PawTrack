import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Pressable } from "react-native";
import { theme } from "../Themed";

type BackIconProps = {
    backPage?: string;
}
const BackIcon = ({ backPage = '' }: BackIconProps) => {
    return (
        <>
            <Link href={`../${backPage}`} asChild>
                <Pressable>
                    {({ pressed }) => (
                        <Ionicons name="chevron-back" size={25} color={theme.brown} style={{ marginLeft: 8, opacity: pressed ? 0.5 : 1 }} />
                    )}
                </Pressable>
            </Link>
        </>
    );
};

export default BackIcon;