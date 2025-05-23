import { FontAwesome } from "@expo/vector-icons";
import { View, getTheme } from '@/components/Themed';
import { TextMedium } from "../StyledText";

type HeaderTextProps = {
    text: string;
};

const HeaderText = ({text}: HeaderTextProps) => {
    const theme = getTheme();
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: theme.beige }}>
            <TextMedium style={{ fontSize: 28, color: theme.brown }}>{text}</TextMedium>
            <FontAwesome name="paw" size={28} color={theme.orange} />
        </View>
    );
};

export default HeaderText;