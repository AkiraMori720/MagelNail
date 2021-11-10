import { StyleSheet } from "react-native";
import {COLOR_YELLOW} from '../../constants/colors';

export default StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingBottom: 20,
        paddingHorizontal: 12
    },
    owner: {
        marginBottom: 8,
        flexDirection: 'row',
        alignItems: 'center'
    },
    avatarContainer: {
        position: 'relative'
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: 'grey'
    },
    profileInfo: {
        marginLeft: 20,
        flexGrow: 1,
        flexDirection: 'column',
        justifyContent: 'center'
    },
    profileName: {
        fontSize: 16
    },
    captionText: {
        marginTop: 4,
        fontSize: 12,
    },
    content: {
        position: 'relative',
    },
    titleText: {
        paddingVertical: 12,
        fontSize: 16,
        fontWeight: 'bold'
    },
    photoImage: {
        width: '100%',
        height: 300,
        resizeMode: 'contain'
    },
    likingImage: {
        position: 'absolute',
        left: 12,
        bottom: 12,
        width: 48,
        height: 48
    },
    video: {
        width: '100%',
        height: 300,
        resizeMode: 'contain'
    },
    thumbnailContainer:{
        position: "relative",
        backgroundColor: 'black'
    },
    thumbnail: {
        width:'100%',
        height: 300,
        resizeMode: 'contain'
    },
    playIcon:{
        alignItems:'center',
        justifyContent: 'center',
        width:'100%',
        height: 300
    },
    likes: {
        paddingVertical: 8,
        flexDirection: 'row',
        alignItems: 'center'
    },
    likesContent: {
        marginLeft: 12
    },
    actionImage: {
        width: 24,
        height: 24,
        paddingVertical: 4,
        marginHorizontal: 8,
        tintColor: COLOR_YELLOW
    },
    comment: {
        paddingVertical: 8,
        flexDirection: 'row',
        alignItems: 'center'
    },
    commentInput: {
        flexGrow: 1,
        borderBottomWidth: 0,
        marginLeft: 12,
        marginBottom: 0
    },
    likesAccounts: {
        flexDirection: 'row',
        marginLeft: 12
    },
    likeAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'grey'
    },
    commentContents: {
        marginTop: 12,
        paddingLeft: 12,
    },
    commentContainer: {
        marginBottom: 12,
    },
    commentMain: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginRight: 40
    },
    commentContent: {
        flexGrow: 1,
        borderRadius: 8,
        marginLeft: 12,
        padding: 4
    },
    commentAccountName: {
        fontSize: 14
    },
    commentText: {
        fontSize: 14,
        color: 'grey'
    },
    commentFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingLeft: 54
    },
    commentTime: {
        fontSize: 12,
        color: 'grey'
    },
    commentAvatar: {
        width: 40,
        height: 40,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: 'grey'
    },
    replyAction: {
        marginLeft: 12,
        flexDirection: 'row',
        alignItems: 'center'
    },
    commentTimeIcon: {
        width: 12,
        height: 12,
        marginLeft: 4
    },
    commentReplyIcon: {
        width: 12,
        height: 12
    },
    replyText: {
        marginLeft: 4,
        fontSize: 12
    }
});
