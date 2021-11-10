import { StyleSheet } from "react-native";
import {COLOR_BORDER} from "../../constants/colors";
import sharedStyles from '../../views/Styles';

export default StyleSheet.create({
    mainContainer: {
        flex: 1
    },
    bottomLinearGradient:{
        height: 2
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 4,
        maxHeight: 100
    },
    input: {
        flex: 1,
        flexGrow: 1,
        marginLeft: 8,
        marginRight: 12,
        borderRadius: 24,
        paddingVertical: 4,
        paddingHorizontal: 12,
        marginVertical: 8,
        fontSize: 16,
        backgroundColor: 'white',
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: COLOR_BORDER,
        flexWrap: "wrap",
    },
    actionButtonContainer: {
        paddingHorizontal: 8
    },
    actionButtonPhoto: {
        width: 28,
        height: 28,
        resizeMode: 'contain'
    },
    actionButtonImage: {
        width: 24,
        height: 24,
        resizeMode: 'contain'
    },
    btnContainer: {
        marginRight: 12
    },
    sendBtn: {
        width: 28,
        height: 28,
        resizeMode: 'contain'
    },
    messageContainer: {
        paddingHorizontal: 4,
        marginVertical: 2,
    },
    messageOwnContent: {

    },
    messageContent: {

    },
    messageInnerContent: {
        position: 'relative',
        marginHorizontal: 4
    },
    photoInnerContent: {
        marginHorizontal: 8,
        position: 'relative'
    },
    contentBackground: {
        width: 48,
        height: 36,
        resizeMode: 'contain',
        position: 'absolute'
    },
    contentOtherBackground: {
        transform: [
            {rotateY: '180deg'}
        ],
        width: 48,
        height: 36,
        resizeMode: 'contain',
        position: 'absolute'
    },
    messageOwnText: {
        paddingHorizontal: 14,
        marginRight: 5,
        marginTop: 3,
        paddingVertical: 8,
        borderRadius: 8,
        overflow: 'hidden',
        minWidth: 50,
    },
    messageOtherText: {
        paddingHorizontal: 14,
        marginLeft: 5,
        marginTop: 3,
        paddingVertical: 8,
        borderRadius: 8,
        overflow: 'hidden',
        minWidth: 50,
    },
    imageMsg: {
        width: 200,
        height: 200,
        padding: 4,
        marginRight: 5,
        marginTop: 3,
        borderRadius: 8,
        overflow: 'hidden'
    },
    imageOtherMsg: {
        width: 200,
        height: 200,
        padding: 4,
        marginLeft: 5,
        marginTop: 3,
        borderRadius: 8,
        overflow: 'hidden'
    },
    photoMessage: {
        width: '100%',
        height: '100%'
    },
    noPosts: {
        marginTop: 40,
        alignSelf: 'center'
    },
    dateSeparator: {
        marginVertical: 8
    },
    dateSepText: {
        textAlign: 'center',
        fontSize: 14,
        ...sharedStyles.textMedium
    },
    activeImageContainer:  {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        backgroundColor: '#000000E0',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    activeImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain'
    },
    typing: {
        paddingLeft: 12,
        marginTop: 8
    }
});
