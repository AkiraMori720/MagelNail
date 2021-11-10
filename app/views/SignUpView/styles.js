import { StyleSheet } from "react-native";
import sharedStyles from '../Styles';

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
        padding: 24
    },
    logo: {
        marginTop: 20,
        height: 120,
        alignSelf: 'center',
        resizeMode: 'contain',
    },
    formContainer: {
        paddingVertical: 16,
        paddingHorizontal: 4
    },
    inputStyle: {
        height: 36,
        fontSize: 16,
        paddingVertical: 0,
        backgroundColor: 'white'
    },
    selectStyle: {
    },
    textareaStyle: {
        height: 120,
        textAlignVertical: 'top',
        paddingVertical: 24
    },
    submitBtn: {
        marginTop: 12,
        paddingVertical: 2,
        alignSelf: 'center'
    },
    bottomContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
        marginBottom: 40
    },
    oauthContainer: {
        flexGrow: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 12
    },
    forgotContainer: {
        marginVertical: 20
    },
    forgotText: {
        textAlign: 'center',
        textDecorationLine: 'none'
    },
    back: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        zIndex: 0
    },
    terms: {
    },
    termItem: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    bottom: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 30
    },
    bottomBarContainer: {
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        paddingTop: 5,
    },
    bottomBarInnerContainer: {
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        height: 25
    },
});
