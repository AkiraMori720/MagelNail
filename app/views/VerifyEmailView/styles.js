import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
    logoContainer: {
        flex: 1,
        borderTopLeftRadius: 250,
        borderTopRightRadius: 250,
    },
    logoInnerContainer: {
        flex: 1,
        marginTop: 12,
        borderTopLeftRadius: 250,
        borderTopRightRadius: 250,
        padding: 24,
    },
    logo: {
        marginTop: 40,
        height: 180,
        alignSelf: 'center',
        resizeMode: 'contain',
    },
    mainText: {
        textAlign: 'center',
        marginHorizontal: 20,
        textTransform: 'uppercase',
        fontSize: 20,
    },
    subText: {
        textAlign: 'center',
        marginHorizontal: 20,
        marginTop: 20
    },
    actionBtn: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 24,
        paddingVertical: 8,
        paddingHorizontal: 24
    },
    iconStyle: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
        marginRight: 12
    },
    actionText: {
        textTransform: 'uppercase',
        fontSize: 20,
        color: 'white'
    }
});
