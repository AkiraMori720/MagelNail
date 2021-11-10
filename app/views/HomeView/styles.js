import { StyleSheet } from "react-native";

export default StyleSheet.create({
    tabBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    tabContainer: {
        width: '33%',
    },
    tabLabel: {
        textAlign: 'center',
        paddingVertical: 12,
    },
    addMeetupBtn: {
        position: 'absolute',
        right: 16,
        bottom: 16,
        zIndex: 10
    },
    addImage: {
        width: 60,
        height: 60,
        borderRadius: 30
    }
});
