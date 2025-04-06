import { FontAwesome } from "@expo/vector-icons";
import { View, Text as HomeText, theme } from '@/components/Themed';

type HeaderTextProps = {
    text: string;
};

const HeaderText = ({text}: HeaderTextProps) => {
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: theme.beige }}>
            <HomeText style={{ fontSize: 22, fontWeight: 'bold', color: theme.brown}}>{text}</HomeText>
            <FontAwesome name="paw" size={20} color={theme.orange} />
        </View>
    );
};

export default HeaderText;