import { StyleSheet } from "react-native";
import shareStyles from '../../views/Styles';

export default StyleSheet.create({
    headerContainer: {
        marginTop: 40,
        justifyContent: 'center',
        alignItems: 'center',
        height: 100
    },
    headerText: {
        paddingHorizontal: 18,
        resizeMode: 'contain',
        alignSelf: 'center',
        fontSize: 20
    },
    formContainer: {
        flex: 1,
        paddingVertical: 16,
        paddingHorizontal: 18,
    },
    submitBtn: {
        marginTop: 8,
        paddingVertical: 2,
        alignSelf: 'center'
    },
    cardBrand: {
        fontSize: 16,
        paddingVertical: 8,
        alignSelf: 'center'
    },
    cardNumber: {
        fontSize: 16,
        paddingVertical: 8,
        alignSelf: 'center'
    },
    cardExpiry: {
        fontSize: 16,
        paddingVertical: 8,
        alignSelf: 'center'
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalContent: {
        padding: 16,
        width: 360,
        borderRadius: 8
    },
    modalTitle: {
        fontSize: 16,
        paddingBottom: 8,
        ...shareStyles.textBold,
        ...shareStyles.textAlignCenter
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16
    },
    button: {
        marginBottom: 0
    }
});
