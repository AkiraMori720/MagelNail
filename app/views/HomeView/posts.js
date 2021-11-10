import React from 'react';
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {FlatList, RefreshControl, Share, View} from 'react-native';

import {themes} from "../../constants/colors";
import StatusBar from "../../containers/StatusBar";
import {withTheme} from "../../theme";
import NoFriends from "./NoFriends";
import ActivityIndicator from "../../containers/ActivityIndicator";
import * as HeaderButton from '../../containers/HeaderButton';
import MainScreen from '../../containers/MainScreen';
import firestore from '@react-native-firebase/firestore';
import firebaseSdk, {
    DB_ACTION_ADD,
    DB_ACTION_DELETE,
    DB_ACTION_UPDATE,
    NOTIFICATION_TYPE_LIKE,
} from '../../lib/firebaseSdk';
import Post from './Post';
import {GradientHeader} from '../../containers/GradientHeader';
import {withActionSheet} from '../../containers/ActionSheet';
import {showErrorAlert, showToast} from '../../lib/info';
import I18n from '../../i18n';
import {setUser as setUserAction} from '../../actions/login';
import {getStatusBarHeight} from "../../utils/statusbar";

class PostsView extends React.Component {
    static propTypes = {
        user: PropTypes.object,
        setUser: PropTypes.func,
        theme: PropTypes.string,
    }

    constructor(props) {
        super(props);
        this.mounted = false;
        this.state = {
            text: '',
            data: [],
            showModal: false,
            showAddModal: false,
            editMeetup: null,
            reviewMeetup: null,
            refreshing: false,
            loading: false,
            notifying: false,
            isUpdating: false,
            actionPost: null
        }

        // Actions
        this.options = [
            {
                title: I18n.t('Report_post'),
                onPress: this.onReport
            },
            {
                title: I18n.t('Block_user'),
                danger: true,
                onPress: this.onBlock
            }
        ];

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

    init = async () => {
        const {user} = this.props;

        if(this.unSubscribePost){
            this.unSubscribePost();
        }

        let postSubscribe = await firestore().collection(firebaseSdk.TBL_POST);
        this.unSubscribePost = postSubscribe.onSnapshot(async (querySnapShot) => {
            const userSnaps = await firestore().collection(firebaseSdk.TBL_USER).get();
            const users = [];
            userSnaps.forEach(s => users.push(s.data()));

            let list = [];
            querySnapShot.forEach(doc => {
                const post = doc.data();
                if((!user.blocked || !user.blocked.includes(post.userId))){
                    const owner = users.find(u => u.userId === post.userId);
                    list.push({id: doc.id, ...post, owner});
                }
            });
            list.sort((a, b) => b.date - a.date);
            if (this.mounted) {
                this.setState({data: list, refreshing: false});
            } else {
                this.state.data = list;
                this.state.refreshing = false;
            }
            console.log('list', list, users);
        })
    }

    onOpenPost = (item) => {
        this.props.navigation.push('PostDetail', {post: item});
    }

    onOpenProfile = (item) => {
        const {user, navigation} = this.props;
        if(item.userId === user.userId){
            navigation.push('Profile');
        } else {
            navigation.push('OtherProfile', {userId: item.userId});
        }
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

    onReport = () => {
        const {user} = this.props;
        const {actionPost} = this.state;

        if(!actionPost) return;

        const report = {
            userId: user.userId,
            postId: actionPost.id,
            ownerId: actionPost.owner.userId,
            createdAt: new Date()
        };

        this.setState({isUpdating: true});
        firebaseSdk.setData(firebaseSdk.TBL_REPORTS, DB_ACTION_ADD, report)
            .then(() => {
                this.setState({isUpdating: false});
                showToast(I18n.t('Report_post_complete'));
            })
            .catch(err => {
                showErrorAlert(I18n.t('Report_post_failed'), I18n.t('Oops'));
                this.setState({isUpdating: false});
            })
    }

    onBlock = () => {
        const {actionPost} = this.state;
        const {user, setUser} = this.props;

        if(!actionPost) return;

        const account = actionPost.owner;
        let blocked = user.blocked??[];
        let update = {id: user.id, blocked:[...blocked, account.userId]};

        this.setState({isUpdating: true});
        firebaseSdk.setData(firebaseSdk.TBL_USER, DB_ACTION_UPDATE, update)
            .then(() => {
                setUser({blocked: update.blocked});
                showToast(I18n.t('Block_user_complete'));
                this.setState({isUpdating: false});
                this.init();
            })
            .catch(err => {
                showErrorAlert(I18n.t('Block_user_failed'), I18n.t('Oops'));
                this.setState({isUpdating: false});
            })
    }

    onEdit = () => {
        const {actionPost} = this.state;
        if(!actionPost) return;
        const {navigation} = this.props;
        navigation.push('EditPost', {postId: actionPost.id});
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

        this.setState({isUpdating: true});
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
                        message: I18n.t(`likes_your_post`, {name: user.displayName}),
                        date: new Date()
                    }
                    firebaseSdk.addActivity(activity, item.owner.token).then(r => {});
                }
                this.setState({isUpdating: false});
            })
            .catch(() => {
                this.setState({isUpdating: false});
            })
    }

    onActionPost = (item) => {
        const { showActionSheet, user } = this.props;
        this.setState({actionPost: item});
        const isOwner = item.owner.userId === user.userId;
        showActionSheet({ options: isOwner?this.ownerOptions:this.options });
    }

    renderFooter = () => {
        const {loading} = this.state;
        const {theme} = this.props;
        if (loading) {
            return <ActivityIndicator theme={theme} size={'large'}/>;
        }
        return null;
    }

    onRefresh = () => {
        this.setState({refreshing: true});
        this.init();
    }

    render() {
        const {user, navigation, theme} = this.props;
        const {
            data,
            loading,
            isUpdating,
            refreshing,
        } = this.state;

        return (
            <MainScreen
                navigation={navigation}
                headerLeft={() => <HeaderButton.Drawer navigation={navigation} testID='nav-drawer' />}
                headerRight={() => <HeaderButton.Search title='menu' navigation={navigation}/>}
            >
                <StatusBar/>
                { isUpdating && <ActivityIndicator absolute theme={theme} size={'large'}/> }
                {((data.length > 0) || loading) ?
                    <FlatList
                        style={{flexGrow: 1, marginBottom: 80, marginTop: 50 + getStatusBarHeight(true)}}
                        data={data}
                        renderItem={({item, index}) =>
                            <Post
                                key={index}
                                item={item}
                                onPressUser={() => this.onOpenProfile(item)}
                                onPress={() => this.onOpenPost(item)}
                                onPressShare={() => this.onSharePost(item)}
                                onLike={(isLiking) => this.onToggleLike(item, isLiking)}
                                isLiking={item.likes && item.likes.includes(user.userId)}
                                onPressAction={() => this.onActionPost(item)}
                                theme={theme}/>}
                        keyExtractor={item => item.id}
                        ListFooterComponent={this.renderFooter}
                        refreshControl={(
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={this.onRefresh}
                                tintColor={themes[theme].actionColor}
                            />
                        )}
                    /> :
                    <NoFriends onPress={() => {}}/>
                }
            </MainScreen>
        )
    }
}

const mapStateToProps = state => ({
    user: state.login.user
})

const mapDispatchToProps = dispatch => ({
    setUser: params => dispatch(setUserAction(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withActionSheet(withTheme(PostsView)));
