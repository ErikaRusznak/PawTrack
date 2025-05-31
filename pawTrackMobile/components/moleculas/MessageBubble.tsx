import { Message } from "@/src/Message";
import { UserData } from "@/src/User";
import moment from "moment";
import React from "react";
import { View, StyleSheet, Image } from "react-native";
import { TextLight, TextRegular } from "../StyledText";

type MessageBubble = {
    message: Message;
    isOwn: boolean;
    profile: UserData;
}

const MessageBubble = ({ message, isOwn, profile }) => {

    const showText = !!message.text;
    const showImage = !!message.picture;
    let time = '';
    if (message.sentAt) {
        time = moment(message.sentAt).format("HH:mm")
    }
    return (
        <>
            {showText && (
                <View style={[ styles.textRow, isOwn ? styles.textRowOwn : styles.textRowOther, showImage ? { marginBottom: 4 } : { marginBottom: 16 },]}>
                    <View style={[styles.textBubble, isOwn ? styles.textBubbleOwn : styles.textBubbleOther]}>
                        <TextRegular style={[styles.textBase, isOwn ? { textAlign: 'left', color: '#443627' } : { textAlign: 'left', color: '#fff' },]}>{message.text}</TextRegular>
                        <TextLight style={[styles.time, isOwn ? { color: "#443627"} : { color: "#fff"}]}>{time}</TextLight>
                    </View>
                </View>
            )}
            {showImage && (
                <View style={[ styles.imageRow, isOwn ? { justifyContent: 'flex-end' } : { justifyContent: 'flex-start' },]}>
                    {!isOwn && profile && (
                        <Image source={{ uri: profile.picture }} style={styles.avatarSmall} />
                    )}
                    <Image source={{ uri: message.picture }} style={styles.separateImage} resizeMode="cover" />
                    {isOwn && profile && (
                        <Image source={{ uri: profile.picture }} style={styles.avatarSmall} />
                    )}
                </View>
            )}
        </>
    );
};

const styles = StyleSheet.create({
    textRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        width: '100%',
    },
    textRowOther: {
        marginLeft: 38,
        color: "#fff",
    },
    textRowOwn: {
        justifyContent: 'flex-end',
        color: "#443627"
    },
    textBase: {
        fontSize: 15,
        maxWidth: 260,
    },
    textBubble: {
        borderRadius: 12,
        paddingVertical: 8,
        paddingHorizontal: 10,
        maxWidth: 260,
        minWidth: 40,
        marginRight: 38,
    },
    textBubbleOther: {
        backgroundColor: '#443627', 
    },
    textBubbleOwn: {
        backgroundColor: '#efdcab',
    },
    imageRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginBottom: 16,
    },
    avatarSmall: {
        width: 36,
        height: 36,
        borderRadius: 18,
        marginRight: 1,
        marginLeft: 1,
    },
    separateImage: {
        width: 192,
        height: 108,
        borderRadius: 12,
    },
    time: {
        fontSize: 13,
        alignSelf: 'flex-end',
        marginTop: 2,
    },

});

export default MessageBubble;