import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: 100,
        marginTop: 12,
        paddingHorizontal: 16
    },
    orderInfoContainer: {
        width: '100%'
    },
    orderInfo: {
        marginTop: 8,
        borderWidth: 2,
        borderColor: '#cbcbcb',
        borderRadius: 8,
        padding: 8
    },
    orderNo: {
        marginTop: 8,
        textAlign: 'center',
        fontSize: 20,
        textTransform: 'uppercase'
    },
    totalItem: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    totalTitle: {

    },
    totalValue: {

    },
    splitLine: {
        height: 1,
        backgroundColor: '#cbcbcb',
        marginVertical: 8
    },
    noteText: {
        marginTop: 20,
        marginLeft: 20
    },
    cardContainer: {
        marginTop: 20,
        flexGrow: 1,
        minHeight: 200,
    },
    cardContent: {
        borderWidth: 2,
        borderColor: '#cbcbcb',
        borderRadius: 8,
        padding: 8,
        height: 90
    },
    formContainer: {
        flex: 1
    },
    cardTitle: {

    },
    actionContainer: {
        marginTop: 20,
        width: '100%'
    },
    actionSecondaryBtn: {
        alignItems: 'center',
        borderRadius: 4,
        paddingVertical: 8,
        paddingHorizontal: 24
    },
    actionPrimaryBtn: {
        marginTop: 8,
        alignItems: 'center',
        borderRadius: 4,
        paddingVertical: 8,
        paddingHorizontal: 24
    },
    actionText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center'
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
    }
});
