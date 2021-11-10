import { StyleSheet } from "react-native";

export default StyleSheet.create({
    logoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        borderBottomRightRadius: 32,
        borderBottomLeftRadius: 32,
        borderWidth: StyleSheet.hairlineWidth
    },
    backAction: {
        position: 'absolute',
        bottom: 16,
        right: 16
    },
    backImage: {
        width:'100%',
        height: 270,
        resizeMode: 'cover',
        borderBottomRightRadius: 32,
        borderBottomLeftRadius: 32
    },
    logo: {
        width:'100%',
        height: 160,
        resizeMode: 'contain',
        borderBottomRightRadius: 32,
        borderBottomLeftRadius: 32
    },
    profileContainer: {
        paddingVertical: 12,
        paddingHorizontal: 12
    },
    mainInfo: {
        flexDirection: 'row'
    },
    salonName: {
        marginTop: 8,
        fontSize: 16,
        textTransform: 'uppercase'
    },
    type: {
        marginTop: 2,
        fontSize: 12
    },
    bio: {
        marginTop: 8,
        fontSize: 12
    },
    avatarContainer: {
    },
    avatar: {
        width: 88,
        height: 88,
        borderRadius: 44,
        borderWidth: 1,
        borderColor: 'grey'
    },
    profileInfo: {
        marginLeft: 20,
        flexGrow: 1
    },
    profileTitle: {
        marginTop: 4,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    profileNameContainer:{
        paddingBottom: 2,
        borderBottomWidth: 1,
        marginRight: 20,
        flexGrow: 1
    },
    profileName: {
        fontSize: 20,
        color: 'black'
    },
    settingIcon: {
        width: 16,
        height: 16,
        resizeMode: 'contain'
    },
    editProfile: {
        marginTop: 12,
    },
    editProfileBtn: {
        width: 100,
        height: 24,
        resizeMode: 'contain',
    },
    actionContainer:{
        marginTop: 8,
        flexDirection: 'row',
        alignItems: 'center'
    },
    itemAction: {
        width: 100,
        height: 24,
        resizeMode: 'contain',
        alignItems: 'center',
        justifyContent: 'center'
    },
    actionText: {
        fontSize: 12,
        marginLeft: 12
    },
    options: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        marginVertical: 8
    },
    optionContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '30%'
    },
    borderLeft: {
        borderLeftWidth: StyleSheet.hairlineWidth,
        borderLeftColor: 'grey'
    },
    borderRight: {
        borderRightWidth: StyleSheet.hairlineWidth,
        borderRightColor: 'grey'
    },
    optionValue: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    optionTitle: {
        fontSize: 12
    },
});
