import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import {getTheme} from "@/components/Themed";

interface Props {
    page: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
}

const Paginator: React.FC<Props> = ({ page, totalItems, itemsPerPage, onPageChange }) => {
    const theme = getTheme()

    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const canGoPrev = page > 0;
    const canGoNext = page < totalPages - 1;

    return (
        <View style={{ alignItems: 'center', marginTop: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <TouchableOpacity
                    disabled={!canGoPrev}
                    onPress={() => canGoPrev && onPageChange(page - 1)}
                >
                    <AntDesign name="left" size={20} color={canGoPrev ? theme.brown : '#ccc'} />
                </TouchableOpacity>

                <View
                    style={{
                        borderWidth: 1,
                        borderColor: theme.brown,
                        borderRadius: 999,
                        paddingHorizontal: 10,
                        paddingVertical: 4,
                    }}
                >
                    <Text style={{ fontSize: 16, color: theme.brown }}>{page + 1}</Text>
                </View>

                <TouchableOpacity
                    disabled={!canGoNext}
                    onPress={() => canGoNext && onPageChange(page + 1)}
                >
                    <AntDesign name="right" size={20} color={canGoNext ? theme.brown : '#ccc'} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default Paginator;
