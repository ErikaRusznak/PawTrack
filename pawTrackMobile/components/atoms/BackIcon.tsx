import { Ionicons } from "@expo/vector-icons";
import { RelativePathString, useRouter } from "expo-router";
import { Pressable } from "react-native";
import { getTheme } from "../Themed";

type BackIconProps = {
    backPage?: string;
}
const BackIcon = ({ backPage = '' }: BackIconProps) => {
    const router = useRouter();
    const theme = getTheme();
    return (
        <>
            <Pressable>
                {({ pressed }) => (
                    <Ionicons name="chevron-back" onPress={() => router.replace(backPage as RelativePathString)} size={25} color={theme.brown} style={{ marginLeft: 8, opacity: pressed ? 0.5 : 1 }} />
                )}
            </Pressable>
        </>
    );
};

export default BackIcon;

