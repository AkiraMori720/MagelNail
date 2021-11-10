import React from 'react';
import PropTypes from 'prop-types';
import {Image, ImageBackground, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {connect} from "react-redux";

import {withTheme} from "../../theme";
import KeyboardView from "../../containers/KeyboardView";
import sharedStyles from "../Styles";
import StatusBar from "../../containers/StatusBar";
import styles from "./styles";
import images from "../../assets/images";
import scrollPersistTaps from "../../utils/scrollPersistTaps";
import SafeAreaView from "../../containers/SafeAreaView";
import {setUser as setUserAction} from "../../actions/login";
import CsTextInput from '../../containers/CsTextInput';
import ActivityIndicator from '../../containers/ActivityIndicator';
import {POST_TYPE_PHOTO, POST_TYPE_TEXT, POST_TYPE_VIDEO} from '../../constants/app';
import Video from 'react-native-video';
import firebaseSdk, {
    DB_ACTION_UPDATE,
    NOTIFICATION_TYPE_COMMENT,
    NOTIFICATION_TYPE_LIKE,
} from '../../lib/firebaseSdk';
import {HEADER_BAR_END, HEADER_BAR_START, themes} from '../../constants/colors';
import {VectorIcon} from '../../containers/VectorIcon';
import {dateStringFromNow} from '../../utils/datetime';
import firestore from '@react-native-firebase/firestore';
import {GradientHeader} from '../../containers/GradientHeader';
import LinearGradient from 'react-native-linear-gradient';
import I18n from '../../i18n';
import PageContainer from "../../containers/PageContainer";
import {getStatusBarHeight} from "../../utils/statusbar";

class PostDetailView extends React.Component{

    static propTypes = {
        navigation: PropTypes.object,
        user: PropTypes.object,
        setUser: PropTypes.func,
        theme: PropTypes.string
    }

    constructor(props) {
        super(props);
        const post = props.route.params?.post;
        this.state = {
            post,
            thumbnail: null,
            playing: false,
            comment: '',
            isLoading: false,
            initializing: true
        }
        this.init(post.id);
    }

    componentDidMount() {
        this.mounted = true;
    }

    setSafeState(states){
        if(this.mounted){
            this.setState(states);
        } else {
            this.state = {...this.state, ...states};
        }
    }

    componentWillUnmount() {
        if(this.unSubscribePost){
            this.unSubscribePost();
        }
    }

    init = async (id) => {
        let postSubscribe = await firestore().collection(firebaseSdk.TBL_POST).doc(id);
        this.unSubscribePost = postSubscribe.onSnapshot(async (querySnapShot) => {
            const userSnaps = await firestore().collection(firebaseSdk.TBL_USER).get();
            const users = [];
            userSnaps.forEach(s => users.push(s.data()));

            const data = querySnapShot.data();

            const owner = users.find(u => u.userId === data.userId);
            const likes_accounts = data.likes.map(l => {
                const like_user = users.find(u => u.userId === l);
                return {userId: l, avatar: like_user?.avatar};
            })
            const comment_accounts = data.comments.map(c => {
                const comment_user = users.find(u => u.userId === c.userId);
                return {...c, avatar: comment_user?.avatar, accountName: comment_user.displayName};
            }).sort((a, b) => a.date.seconds - b.date.seconds)
            const post  = {id: querySnapShot.id, ...data, owner, likes_accounts, comment_accounts};

            this.setSafeState({post, initializing: false});
            console.log('post', post);
        })
    }

    isValid = () => {
        const {comment} = this.state;
        if(!comment.trim().length){
            return false;
        }
        return true;
    }


    onMore = () => {

    }

    toggleLikes = (isLiking) => {
        const {post} = this.state;
        const {user} = this.props;

        let update = {};
        if(isLiking){
            update = {id: post.id, likes : post.likes.filter(l => l !== user.userId)};
        } else {
            update = {id: post.id, likes : [...post.likes, user.userId]};
        }

        this.setState({isLoading: true});
        firebaseSdk.setData(firebaseSdk.TBL_POST, DB_ACTION_UPDATE, update)
            .then(() => {
                if(!isLiking && post.owner.userId !== user.userId){
                    const postImage = post.type === 'video'? post.thumbnail: (post.type === 'photo'?post.photo:'');
                    const activity = {
                        type: NOTIFICATION_TYPE_LIKE,
                        sender: user.userId,
                        receiver: post.owner.userId,
                        content: '',
                        postId: post.id,
                        postImage,
                        postType: post.type,
                        title: post.owner.displayName,
                        message: I18n.t(`likes_your_post`, {name: user.displayName}),
                        date: new Date()
                    }
                    firebaseSdk.addActivity(activity, post.owner.token).then(r => {});
                }
                this.setState({isLoading: false});
            })
            .catch(() => {
                this.setState({isLoading: false});
            })
    }

    onComment = () => {
        const {user} = this.props;
        const {post, comment} = this.state;
        if(this.isValid()){
            let update = {id: post.id, comments : [...post.comments, {userId: user.userId, text: comment.trim(), date: new Date()}]};

            this.setState({isLoading: true});
            firebaseSdk.setData(firebaseSdk.TBL_POST, DB_ACTION_UPDATE, update)
                .then(() => {
                    if(post.owner.userId !== user.userId){
                        const postImage = post.type === 'video'? post.thumbnail: (post.type === 'photo'?post.photo:'');
                        const activity = {
                            type: NOTIFICATION_TYPE_COMMENT,
                            sender: user.userId,
                            receiver: post.owner.userId,
                            content: comment.trim(),
                            postId: post.id,
                            postImage,
                            postType: post.type,
                            title: post.owner.displayName,
                            message: I18n.t(`commented_in_your_post`, {name: user.displayName}),
                            date: new Date()
                        }
                        firebaseSdk.addActivity(activity, post.owner.token).then(r => {});
                    }
                    this.textInput.clear();
                    this.setState({comment: '', isLoading: false});
                })
                .catch(() => {
                    this.setState({isLoading: false});
                })
        }
    }

    render(){
        const {user, navigation, theme} = this.props;
        const {post, comment, playing, isLoading, initializing} = this.state;

        if(initializing){
            return (
                <View style={sharedStyles.container}>
                    <StatusBar/>
                    <ActivityIndicator absolute theme={theme} size={'large'}/>
                </View>
            );
        }

        const isLiking = post.likes && post.likes.includes(user.userId);
        return (
            <PageContainer navigation={navigation}>
                <StatusBar/>
                <LinearGradient colors={[HEADER_BAR_START, HEADER_BAR_END]} style={sharedStyles.topLinearGradient} angle={90} useAngle/>
                <KeyboardView
                    contentContainerStyle={sharedStyles.container}
                    keyboardVerticalOffset={128}
                >
                    <ScrollView contentContainerStyle={[styles.container, {marginTop: 50 + getStatusBarHeight(true)}]} {...scrollPersistTaps}>
                        {
                            isLoading && <ActivityIndicator absolute theme={theme} size={'large'}/>
                        }
                        <View style={styles.owner}>
                            <View style={styles.avatarContainer}>
                                <Image
                                    source={post.owner.avatar ? {uri: post.owner.avatar} : images.default_avatar}
                                    style={styles.avatar}/>
                            </View>
                            <View style={styles.profileInfo}>
                                <Text style={styles.profileName}>{post.owner.displayName}</Text>
                            </View>
                            <Text style={[styles.captionText, {color: themes[theme].infoText}]}>{dateStringFromNow(post.date)}</Text>
                        </View>
                        <View style={styles.content}>
                            {
                                post.type === POST_TYPE_TEXT &&
                                <Text style={[styles.titleText, {color: themes[theme].titleText}]}>{post.text}</Text>
                            }
                            {
                                post.type === POST_TYPE_PHOTO &&
                                <>
                                    <Text style={[styles.titleText, {color: themes[theme].titleText}]}>{post.text}</Text>
                                    <Image source={{uri: post.photo}} style={styles.photoImage}/>
                                    {
                                        isLiking &&
                                        <Image source={images.liking} style={styles.likingImage} resizeMode={'contain'}/>
                                    }
                                </>
                            }
                            {
                                post.type === POST_TYPE_VIDEO &&
                                <>
                                    <Text style={[styles.titleText, {color: themes[theme].titleText}]}>{post.text}</Text>
                                    {
                                        playing ?
                                            <Video
                                                source={{uri: post.video}}
                                                style={styles.video}
                                                controls
                                                onEnd={() => this.setState({playing: false})}
                                                resizeMode={'contain'}/>
                                            :
                                            <View style={styles.thumbnailContainer}>
                                                <Image
                                                    source={{uri: post.thumbnail}}
                                                    style={styles.thumbnail}
                                                    resizeMode={'contain'}
                                                />
                                                <TouchableOpacity onPress={() => {
                                                    if(playing){
                                                        onPress();
                                                    } else {
                                                        this.setState({playing: true});
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
                        </View>
                        <View style={styles.likes}>
                            <TouchableOpacity onPress={() => this.toggleLikes(isLiking)}>
                                <Image source={images.like_icon} style={styles.actionImage} resizeMode={'contain'}/>
                            </TouchableOpacity>
                            <Text style={styles.likesContent}>{post.likes?.length??0}</Text>
                            <View style={styles.likesAccounts}>
                                {
                                    post.likes_accounts && post.likes_accounts.map(a => <Image source={a.avatar ? {uri: a.avatar} : images.default_avatar} style={styles.likeAvatar}/>)
                                }
                            </View>
                        </View>
                        <View style={styles.commentContents}>
                            {
                                post.comment_accounts && post.comment_accounts.map(c =>
                                    <View style={styles.commentContainer}>
                                        <View style={styles.commentMain}>
                                            <Image source={c.avatar ? {uri: c.avatar} : images.default_avatar} style={styles.commentAvatar}/>
                                            <View style={[styles.commentContent, {backgroundColor: themes[theme].auxiliaryBackground}]}>
                                                <Text style={styles.commentAccountName}>{c.accountName}</Text>
                                                <Text style={styles.commentText}>{c.text}</Text>
                                            </View>
                                        </View>
                                        <View style={styles.commentFooter}>
                                            <Text style={styles.commentTime}>{dateStringFromNow(c.date)}</Text>
                                            {/*<Image source={images.clock_icon} style={styles.commentTimeIcon} resizeMode={'contain'}/>*/}
                                            {/*<TouchableOpacity style={styles.replyAction} onPress={() => {}}>*/}
                                            {/*    <Image source={images.reply_icon} style={styles.commentReplyIcon} resizeMode={'contain'}/>*/}
                                            {/*    <Text style={[styles.replyText, {color: themes[theme].actionColor}]}>Reply</Text>*/}
                                            {/*</TouchableOpacity>*/}
                                        </View>
                                    </View>
                                )
                            }
                        </View>
                        <View style={styles.comment}>
                            <CsTextInput
                                inputRef={(e) => {
                                    this.textInput = e;
                                }}
                                containerStyle={styles.commentInput}
                                inputStyle={{paddingVertical: 4, borderRadius: 8, backgroundColor: themes[theme].auxiliaryBackground, color: 'black'}}
                                placeholder={I18n.t('Add_a_comment')}
                                returnKeyType='send'
                                keyboardType='default'
                                onChangeText={text => this.setState({comment: text})}
                                onSubmitEditing={this.onComment}
                                theme={theme}
                            />
                            <TouchableOpacity onPress={() => this.onComment()}>
                                <Image source={images.comment} style={styles.actionImage} resizeMode={'contain'}/>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </KeyboardView>
            </PageContainer>
        );
    }
}

const mapStateToProps = state => ({
    user: state.login.user
})

const mapDispatchToProps = dispatch =>({
    setUser: params => dispatch(setUserAction(params))
})

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(PostDetailView));
