import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        paddingBottom: 40,
        alignItems: 'center',
        marginTop: 12,
        paddingHorizontal: 16
    },
    shippingTitle: {
        textAlign: 'center'
    },
    shippingContainer: {
        width: '100%',
    },
    orderTitle: {
        marginTop: 20,
        textAlign: 'left',
        textTransform: 'uppercase'
    },
    shippingContent: {
        marginTop: 8,
        borderWidth: 2,
        borderColor: '#cbcbcb',
        borderRadius: 8,
        padding: 8
    },
    noteStyle: {
        marginTop: 20,
        color: 'grey'
    },
    actionContainer: {
        borderWidth: 2,
        borderColor: '#cbcbcb',
        borderRadius: 8,
        padding: 8,
        marginTop: 20,
        width: '100%',
        position: 'relative',
    },
    actionLabel: {
        position: 'absolute',
        width: '100%',
        alignItems: 'center',
        top: -12
    },
    proceedPay: {
        backgroundColor: 'white',
        paddingHorizontal: 12
    },
    actionBtns: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    actionSecondaryBtn: {
        marginTop: 20,
        alignItems: 'center',
        borderRadius: 4,
        paddingVertical: 8,
        paddingHorizontal: 24,
        width: '100%'
    },
    creditPayBtn: {
        width: '48%',
        marginTop: 8,
        alignItems: 'center',
        borderRadius: 4,
        paddingVertical: 8,
        paddingHorizontal: 24,
    },
    btnIcon: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
        marginRight: 8
    },
    appleBtn: {
        width: '48%',
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
    inputContainer: {
        marginVertical: 4
    },
    inputLabel: {
        fontSize: 12
    },
    textarea: {
        borderWidth: 1,
        borderColor: '#cbcbcb',
        borderRadius: 4,
        paddingVertical: 4,
        paddingHorizontal: 8,
        height: 120
    },
    input: {
        borderWidth: 1,
        borderColor: '#cbcbcb',
        borderRadius: 4,
        paddingVertical: 4,
        paddingHorizontal: 8
    }
});
