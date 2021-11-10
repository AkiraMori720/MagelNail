import React, {useState} from 'react';
import {View, StyleSheet, Text, Image, TouchableOpacity} from 'react-native';
import {COLOR_YELLOW, themes} from '../../constants/colors';
import {dateStringFromNow} from "../../utils/datetime";
import images from '../../assets/images';
import {POST_TYPE_PHOTO, POST_TYPE_TEXT, POST_TYPE_VIDEO} from '../../constants/app';
import {VectorIcon} from '../../containers/VectorIcon';
import Video from 'react-native-video';
import I18n from '../../i18n';

const styles = StyleSheet.create({
    container: {
        marginVertical: 4,
        paddingHorizontal: 12,
        paddingVertical: 4
    },
    owner: {
        marginBottom: 12,
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
        borderColor: 'white'
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
    more: {
        width: 8,
        height: 24,
        padding: 8,
        resizeMode: 'contain'
    },
    content: {
        position: 'relative'
    },
    titleText: {
        fontSize: 16,
        fontWeight: 'bold',
        paddingVertical: 12
    },
    photoImage: {
        width: '100%',
        height: 300,
        resizeMode: 'contain',
        borderTopRightRadius:12,
        borderTopLeftRadius: 12
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
    footer: {
        paddingVertical: 4,
        paddingHorizontal: 12,
        marginBottom: 12,
        borderBottomRightRadius:12,
        borderBottomLeftRadius: 12
    },
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 4
    },
    underlineDivider: {
        borderBottomColor: 'grey',
        borderBottomWidth: StyleSheet.hairlineWidth
    },
    actionContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    actionLikImage: {
        width: 20,
        height: 20
    },
    actionText: {
        color: 'grey',
        marginLeft: 8
    },
    actionCommentImage: {
        width: 20,
        height: 20
    },
    actionShareImage: {
        width: 18,
        height: 18
    }
});

const Post = ({ key, item, isLiking, onPressUser, onPress, onPressShare, onPressAction, onLike, theme }) => {
    const [playing, setPlaying] = useState(false);

    return (
        <View key={key} style={[styles.container, {
            borderBottomColor: themes[theme].backgroundColor,
            borderBottomWidth: 8
        }]}>
            <View style={styles.owner}>
                <TouchableOpacity style={{flex: 1, flexGrow: 1, flexDirection: 'row', alignItems: 'center'}} onPress={onPressUser}>
                    <View style={styles.avatarContainer}>
                        <Image
                            source={item.owner.avatar ? {uri: item.owner.avatar} : images.default_avatar}
                            style={styles.avatar}/>
                    </View>
                    <View style={styles.profileInfo}>
                        <Text style={[styles.profileName, {color: themes[theme].titleText}]}>{item.owner.displayName}</Text>
                        <Text
                            style={[styles.captionText, {color: 'grey'}]}>{dateStringFromNow(item.date)}</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={onPressAction} style={{padding: 12}}>
                    <Image
                        source={images.more}
                        style={styles.more}/>
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.content} onPress={onPress}>
                {
                    item.type === POST_TYPE_TEXT &&
                    <Text style={[styles.titleText, {color: themes[theme].titleText}]}>{item.text}</Text>
                }
                {
                    item.type === POST_TYPE_PHOTO &&
                    <>
                        { item.text && <Text style={[styles.titleText, {color: themes[theme].titleText}]}>{item.text}</Text>}
                        <Image source={{uri: item.photo}} style={styles.photoImage}/>
                        {
                            isLiking &&
                            <Image source={images.liking} style={styles.likingImage} resizeMode={'contain'}/>
                        }
                    </>
                }
                {
                    item.type === POST_TYPE_VIDEO &&
                    <>
                        { item.text && <Text style={[styles.titleText, {color: themes[theme].titleText}]}>{item.text}</Text>}
                        {
                            playing ?
                                <Video
                                    source={{uri: item.video}}
                                    style={styles.video}
                                    controls
                                    onEnd={() => setPlaying(false)}
                                    resizeMode={'contain'}/>
                                :
                                <View style={styles.thumbnailContainer}>
                                    <Image
                                        source={{uri: item.thumbnail}}
                                        style={styles.thumbnail}
                                        resizeMode={'contain'}
                                    />
                                    <TouchableOpacity onPress={() => {
                                        if(playing){
                                            onPress();
                                        } else {
                                            setPlaying(true);
                                        }
                                    }} style={[styles.playIcon, {position: 'absolute'}]}>
                                        <VectorIcon
                                            name='playcircleo'
                                            type={'AntDesign'}
                                            size={72}
                                            color={'white'}
                                        />
                                    </TouchableOpacity>
                                </View>
                        }
                        {
                            isLiking &&
                            <Image source={images.liking} style={styles.likingImage} resizeMode={'contain'}/>
                        }
                    </>
                }
            </TouchableOpacity>
            <View style={[styles.footer , {backgroundColor: '#FFF5F5'}]}>
                <View style={[styles.footerRow, styles.underlineDivider]}>
                    <Text style={styles.actionText}>{item.likes?.length ?? 0} {I18n.t('Likes')}</Text>
                    <Text style={styles.actionText}>{item.comments?.length ?? 0} {I18n.t('Comments')} & {item.shares??0} {I18n.t('Shares')}</Text>
                </View>
                <View style={styles.footerRow}>
                    <TouchableOpacity onPress={() => onLike(isLiking)} style={styles.actionContainer}>
                        <Image source={images.like_icon} style={styles.actionLikImage} resizeMode={'contain'}/>
                        <Text style={styles.actionText}>{I18n.t('Likes')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onPress} style={styles.actionContainer}>
                        <Image source={images.comment} style={styles.actionCommentImage} resizeMode={'contain'}/>
                        <Text style={styles.actionText}>{I18n.t('Comment')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onPressShare} style={styles.actionContainer}>
                        <Image source={images.share} style={styles.actionShareImage} resizeMode={'contain'}/>
                        <Text style={styles.actionText}>{I18n.t('Shares')}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

export default Post;
