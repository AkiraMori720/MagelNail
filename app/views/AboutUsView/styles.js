import { StyleSheet } from "react-native";

export default StyleSheet.create({
    mainContainer: {
        marginTop: 20,
        flexGrow: 1,
        position: 'relative'
    },
    navBarContent: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 4,
        marginTop: 20
    },
    pageTitle: {
        flexGrow: 1
    },
    pageTitleText: {
        textTransform: 'uppercase',
        fontSize: 16,
        textAlign: 'center'
    },
    logoContainer: {
        borderTopLeftRadius: 250,
        borderTopRightRadius: 250,
        flexGrow: 1,
    },
    logoInnerContainer: {
        marginTop: 12,
        borderTopLeftRadius: 250,
        borderTopRightRadius: 250,
        flexGrow: 1,
        padding: 16,
    },
    mainText: {
        textAlign: 'center',
        textTransform: 'uppercase',
        marginTop: 20,
        color: '#796256',
        fontSize: 12,
        letterSpacing: -1,
        lineHeight: 20
    },
    bottomContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0
    },
    bottomImage: {
        width: '100%',
        height: '100%'
    }
});
