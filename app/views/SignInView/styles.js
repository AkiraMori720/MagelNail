import { StyleSheet } from "react-native";

export default StyleSheet.create({
    logoContainer: {
        marginTop: 20,
        borderTopLeftRadius: 250,
        borderTopRightRadius: 250,
    },
    logoInnerContainer: {
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
    formContainer: {
        flex: 1,
        flexGrow: 1,
        paddingVertical: 16,
        paddingHorizontal: 18,
    },
    submitBtn: {
        marginTop: 8,
        paddingVertical: 2,
        alignSelf: 'center'
    },
    forgotContainer: {
        marginTop: 20
    },
    forgotText: {
        textAlign: 'center',
        textDecorationLine: 'none'
    },
    oauthContainer: {
        flexGrow: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30,
        marginBottom: 60
    },
    bottom: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 70
    },
    bottomContainer: {
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        paddingTop: 5,
    },
    bottomInnerContainer: {
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        justifyContent: 'center',
        textAlign: 'center',
        paddingBottom: 24,
        height: 65
    },
    bottomContent: {
        flexDirection: 'row',
        justifyContent: 'center'
    }
});
