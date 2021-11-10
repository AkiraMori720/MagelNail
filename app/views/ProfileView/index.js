import React from 'react';
import PropTypes from 'prop-types';
import {themes} from '../../constants/colors';
import StatusBar from '../../containers/StatusBar';
import {withTheme} from '../../theme';
import {Alert, Image, Linking, ScrollView, Share, Text, TouchableOpacity, View} from 'react-native';
import images from '../../assets/images';
import styles from './styles';
import {connect} from 'react-redux';
import {setUser as setUserAction} from '../../actions/login';
import ActivityIndicator from '../../containers/ActivityIndicator';
import * as HeaderButton from '../../containers/HeaderButton';
import MainScreen from '../../containers/MainScreen';
import firebaseSdk, {DB_ACTION_DELETE, DB_ACTION_UPDATE, NOTIFICATION_TYPE_LIKE} from '../../lib/firebaseSdk';
import {showErrorAlert, showToast} from '../../lib/info';
import {VectorIcon} from '../../containers/VectorIcon';
import firestore from '@react-native-firebase/firestore';
import Post from '../HomeView/Post';
import scrollPersistTaps from '../../utils/scrollPersistTaps';
import I18n from '../../i18n';
import {checkCameraPermission, checkPhotosPermission, backImagePickerConfig} from '../../utils/permissions';
import ImagePicker from "react-native-image-crop-picker";
import {isValidURL} from '../../utils/validators';
import {withActionSheet} from '../../containers/ActionSheet';
import {NAIL_TYPES} from "../../constants/app";
import {getStatusBarHeight} from "../../utils/statusbar";

class ProfileView extends React.Component {
    static propTypes = {
        setUser: PropTypes.func,
        user: PropTypes.object,
        theme: PropTypes.string,
    };

    constructor(props) {
        super(props);
        this.mounted = false;

        const userId = props.user.userId;
        this.state = {
            account: {
                userId: userId,
            },
            posts: [],
            actionPost: null,
            isLoading: true,
            updating: false,
            refreshing: false
        };

        this.ownerOptions = [
            {
                title: I18n.t('Edit'),
                onPress: this.onEdit
            },
            {
                title: I18n.t('Remove'),
                danger: true,
                onPress: this.onRemove
            }
        ];
        this.init();
    }

    componentDidMount() {
        this.mounted = true;
    }

    componentWillUnmount() {
        if(this.unSubscribePost){
            this.unSubscribePost();
        }
    }

    setSafeState(states){
        if(this.mounted){
            this.setState(states);
        } else {
            this.state = {...this.state, ...states};
        }
    }

    init = () => {
        const { navigation } = this.props;
        firebaseSdk.getUser(this.state.account.userId)
            .then((user) => {
                console.log('account', user);
                if(this.unSubscribePost){
                    this.unSubscribePost();
                }
                const userPostSubscribe = firestore().collection(firebaseSdk.TBL_POST).where('userId', '==', this.state.account.userId);
                this.unSubscribePost = userPostSubscribe.onSnapshot(querySnap => {
                    let posts = [];
                    querySnap.forEach(doc => { posts.push({id: doc.id, ...doc.data(), owner: user})});
                    posts.sort((a, b) => b.date - a.date);
                    this.setSafeState({account: user, isLoading: false, posts});
                });
            })
            .catch(err => {
                this.setSafeState({isLoading: false});
                showErrorAlert('User not found.', '', () => navigation.pop());
            })
    }

    goToFollowers = async () => {
        const {navigation} = this.props;
        navigation.navigate('Follow', {type: 'followers', account: this.state.account});
    }

    goToFollowings = async () => {
        const { navigation } = this.props;
        navigation.navigate('Follow', {type: 'followings', account: this.state.account});
    }

    onOpenPost = (item) => {
        this.props.navigation.push('PostDetail', {post: item});
    }

    onSharePost = (item) => {
        const permalink = 'https://apps.apple.com/us/app/vip-billionaires-social-chat/id1076103571';
        Share.share({
            message: permalink
        }).then((res) => {
            const update = {id: item.id, shares:((item.shares??0) + 1)}
            firebaseSdk.setData(firebaseSdk.TBL_POST, DB_ACTION_UPDATE, update).catch(err => {});
        }).catch(() => {});
    }

    onEdit = () => {
        const {actionPost} = this.state;
        if(!actionPost) return;
        const {navigation} = this.props;
        navigation.navigate('EditPost', {postId: actionPost.id});
    }

    onRemove = () => {
        const {actionPost} = this.state;
        if(!actionPost) return;
        this.setState({isUpdating: true});
        firebaseSdk.setData(firebaseSdk.TBL_POST, DB_ACTION_DELETE, {id: actionPost.id})
            .then(() => {
                showToast(I18n.t('Remove_post_complete'));
                this.setState({isUpdating: false});
            })
            .catch(err => {
                showErrorAlert(I18n.t('Remove_post_failed'), I18n.t('Oops'));
                this.setState({isUpdating: false});
            })
    }

    onToggleLike = (item, isLiking) => {
        const {user} = this.props;

        let update = {};
        if(isLiking){
            update = {id: item.id, likes : item.likes.filter(l => l !== user.userId)};
        } else {
            update = {id: item.id, likes : [...item.likes, user.userId]};
        }

        this.setState({isLoading: true});
        firebaseSdk.setData(firebaseSdk.TBL_POST, DB_ACTION_UPDATE, update)
            .then(() => {
                if(!isLiking && item.owner.userId !== user.userId){
                    const postImage = item.type === 'video'? item.thumbnail: (item.type === 'photo'?item.photo:'');
                    const activity = {
                        type: NOTIFICATION_TYPE_LIKE,
                        sender: user.userId,
                        receiver: item.owner.userId,
                        content: '',
                        postId: item.id,
                        postImage,
                        postType: item.type,
                        title: item.owner.displayName,
                        message: `${user.displayName} likes your post.`,
                        date: new Date()
                    }
                    firebaseSdk.addActivity(activity, item.owner.token).then(r => {});
                }
                this.setState({isLoading: false});
            })
            .catch(() => {
                this.setState({isLoading: false});
            })
    }

    openLink = (url) => {
        if(url && url.length > 0 && isValidURL(url)){
            Linking.openURL(url);
        }
    }

    onActionPost = (item) => {
        const { showActionSheet } = this.props;
        this.setState({actionPost: item});
        showActionSheet({ options: this.ownerOptions });
    }

    takePhoto = async () => {
        if(await checkCameraPermission()){
            ImagePicker.openCamera(backImagePickerConfig).then(image => {
                this.onUpdateUser(image.path);
            });
        }
    }

    chooseFromLibrary = async () => {
        if(await checkPhotosPermission()) {
            ImagePicker.openPicker(backImagePickerConfig).then(image => {
                this.onUpdateUser(image.path);
            });
        }
    }

    onUpdateUser = (image_path) => {
        const {user, setUser} = this.props;
        this.setState({isLoading: true});
        if(image_path){
            firebaseSdk.uploadMedia(firebaseSdk.STORAGE_TYPE_AVATAR, image_path).then(image_url => {
                let userInfo = {
                    id: user.id,
                    back_image: image_url
                }

                firebaseSdk.setData(firebaseSdk.TBL_USER, DB_ACTION_UPDATE, userInfo)
                    .then(() => {
                        this.setState({isLoading: false});
                        const updateUser = {...user, ...userInfo};
                        setUser(updateUser);
                        this.init();
                    })
                    .catch(err => {
                        showToast(I18n.t(err.message));
                        this.setState({isLoading: false});
                    })
            }).catch((err) => {
                showErrorAlert(err, I18n.t('Oops'));
                this.setState({isLoading: false});
            })
        }
    }

    onEditBackImage = () => {
        Alert.alert(
            '',
            I18n.t('Upload_photo'),
            [
                {
                    text: I18n.t("Cancel"), onPress: () => {
                    }
                },
                {
                    text: I18n.t('Take_a_photo'), onPress: () => {
                        this.takePhoto();
                    }
                },
                {
                    text: I18n.t('Choose_a_photo'), onPress: () => {
                        this.chooseFromLibrary();
                    }
                },
            ]);
    }

    render() {
        const {navigation, user, theme} = this.props;
        const {account, posts, isLoading, refreshing} = this.state;

        if(!user){
            return null;
        }
        const nailType = NAIL_TYPES.find(t => t.value === account.type);
        return (
            <MainScreen
                navigation={navigation}
                headerLeft={() => <HeaderButton.Drawer navigation={navigation} testID='nav-drawer' />}
                headerRight={() => <HeaderButton.Search title='menu' navigation={navigation}/>}
            >
                <StatusBar/>
                <ScrollView style={{flex: 1}}  {...scrollPersistTaps}>
                    <View style={[styles.logoContainer, {backgroundColor: themes[theme].backgroundColor}, account.back_image?{}:{paddingTop: 52 + getStatusBarHeight(true), paddingBottom: 10}]}>
                        <Image style={account.back_image?styles.backImage:styles.logo} source={account.back_image ? {uri: account.back_image} : images.logo}/>
                        <TouchableOpacity onPress={() => this.onEditBackImage()} style={styles.backAction}>
                            <VectorIcon name={"camera-alt"} size={24} color={"grey"} type={"MaterialIcons"}/>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.profileContainer}>
                        <View style={styles.mainInfo}>
                            <View style={styles.avatarContainer}>
                                <Image
                                    source={account.avatar ? {uri: account.avatar} : images.default_avatar}
                                    style={styles.avatar}/>
                            </View>
                            <View style={styles.profileInfo}>
                                <View style={styles.profileTitle}>
                                    <View style={[styles.profileNameContainer, {borderBottomColor: themes[theme].sideTitleText}]}>
                                        <Text style={styles.profileName}>{account.displayName}</Text>
                                    </View>
                                    <TouchableOpacity onPress={() => navigation.push('ProfileEdit')}>
                                        <VectorIcon name={"edit"} size={20} color={"black"} type={"MaterialIcons"}/>
                                    </TouchableOpacity>
                                </View>
                                <Text style={[styles.salonName, {color: themes[theme].sideTitleText}]}>{account.salon_name}</Text>
                                <Text style={[styles.type, {color: themes[theme].titleText}]}>{nailType?.text??''}</Text>
                                <Text style={[styles.bio, {color: 'grey'}]}>{account.bio??''}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.options}>
                        <TouchableOpacity onPress={() => {}}
                                          style={[styles.optionContainer, styles.borderRight]}>
                            <Text style={styles.optionValue}>{posts.length}</Text>
                            <Text style={[styles.optionTitle, {color: themes[theme].readText}]}>{I18n.t('Posts')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.goToFollowers()}
                                          style={[styles.optionContainer]}>
                            <Text style={styles.optionValue}>{account.followers?.length??0}</Text>
                            <Text style={[styles.optionTitle, {color: themes[theme].readText}]}>{I18n.t('Followers')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.goToFollowings()}
                                          style={[styles.optionContainer, styles.borderLeft]}>
                            <Text style={styles.optionValue}>{account.followings?.length??0}</Text>
                            <Text style={[styles.optionTitle, {color: themes[theme].readText}]}>{I18n.t('Followings')}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{flexGrow: 1, marginBottom: 80}}>
                        {
                            posts.map(p => (
                                <Post
                                    key={p.id}
                                    item={p}
                                    onPressUser={() => {}}
                                    onPress={() => this.onOpenPost(p)}
                                    onPressShare={() => this.onSharePost(p)}
                                    onLike={(isLiking) => this.onToggleLike(p, isLiking)}
                                    isLiking={p.likes && p.likes.includes(user.userId)}
                                    onPressAction={() => this.onActionPost(p)}
                                    theme={theme}/>
                            ))
                        }
                    </View>
                </ScrollView>
                {isLoading ? <ActivityIndicator absolute size="large" theme={theme}/> : null}
            </MainScreen>
        );
    }
}

const mapStateToProps = state => ({
    user: state.login.user,
});

const mapDispatchToProps = dispatch => ({
    setUser: params => dispatch(setUserAction(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withActionSheet(withTheme(ProfileView)));
