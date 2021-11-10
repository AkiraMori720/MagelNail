import { StyleSheet } from "react-native";
import {isIOS} from '../../utils/deviceInfo';
import {getStatusBarHeight} from "../../utils/statusbar";

export default StyleSheet.create({
    profileContainer: {
        borderBottomLeftRadius: 64,
        borderBottomRightRadius: 64,
        height: (isIOS?100:80) + getStatusBarHeight(true)
    },
    profileInnerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomLeftRadius: 64,
        borderBottomRightRadius: 64,
        paddingHorizontal: 32,
        paddingTop: isIOS?40:10,
        height: (isIOS?95:75) + getStatusBarHeight(true)
    },
    headerContainer: {
        height: 140,
        alignItems: 'center'
    },
    logoContainer: {
        marginTop: 20,
        borderTopLeftRadius: 250,
        borderTopRightRadius: 250,
    },
    logoInnerContainer: {
        marginTop: 12,
        borderTopLeftRadius: 250,
        borderTopRightRadius: 250,
        paddingVertical: 24
    },
    logo: {
        width: 220,
        height: 90,
        resizeMode: 'contain'
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: 'white'
    },
    profileName: {
        marginLeft: 12,
        fontSize: 16,
        fontWeight: 'bold'
    },
    menuIcon: {
        width: 24,
        height: 24,
        resizeMode: 'contain'
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 12,
        paddingRight: 24,
        marginRight: 12,
        borderTopRightRadius: 32,
        borderBottomRightRadius: 32
    },
    itemLeft: {
        marginRight: 10,
        width: 30,
        alignItems: 'center'
    },
    itemCenter: {
        marginRight: 8
    },
    itemText: {
        marginVertical: 12,
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16
    },
    itemsRight: {
        flex: 1,
        height: 0.5,
        backgroundColor: '#DCB042'
    },
    logoutContainer: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        height: 70,
        paddingTop: 5,
    },
    logoutInnerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        justifyContent: 'center',
        textAlign: 'center',
        height: 65
    },
    logoutMenu: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 12,

    },
    logoutText: {
        fontWeight: 'bold',
        fontSize: 16
    },
    logoutIcon: {
        width: 20,
        height: 20,
        marginRight: 8
    }
});
