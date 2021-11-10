import React from 'react';
import PropTypes from "prop-types";
import {themes} from '../../constants/colors';
import StatusBar from "../../containers/StatusBar";
import {withTheme} from "../../theme";
import {FlatList, Image, ImageBackground, RefreshControl, Text, TouchableOpacity, View} from 'react-native';
import debounce from "../../utils/debounce";
import styles from "./styles";
import {setUser as setUserAction} from "../../actions/login";
import images from "../../assets/images";
import firestore from "@react-native-firebase/firestore";
import firebaseSdk, {
    DB_ACTION_ADD,
    DB_ACTION_DELETE,
    NOTIFICATION_TYPE_FOLLOW,
} from '../../lib/firebaseSdk';
import {connect} from "react-redux";
import ActivityIndicator from "../../containers/ActivityIndicator";
import sharedStyles from '../Styles';
import I18n from '../../i18n';
import PageContainer from "../../containers/PageContainer";
import {VectorIcon} from "../../containers/VectorIcon";
import {getStatusBarHeight} from "../../utils/statusbar";


class FriendView extends React.Component {

    static propTypes = {
        user: PropTypes.object,
        theme: PropTypes.string,
    }

    constructor(props) {
        super(props);
        this.mounted = false;
        this.state = {
            text: '',
            data: [],
            friends: [],
            searchData: [],
            refreshing: false,
            loading: true,
            updating: false,
        }
        this.init();
    }

    componentDidMount() {
        this.mounted = true;
    }

    init = async () => {
        const {user} = this.props;
        const userSnaps = await firestore().collection(firebaseSdk.TBL_USER).get();
        const postSnaps = await firestore().collection(firebaseSdk.TBL_POST).get();
        const posts = [];
        postSnaps.forEach(p => posts.push({id: p.id, userId: p.data().userId}));
        const users = [];
        const friends = [];
        console.log('posts', posts);
        userSnaps.forEach(s => {
            const userInfo = {...s.data(), id: s.id};
            if(userInfo.userId !== user.userId && !user.blocked.includes(userInfo.userId)){
                const userPosts = posts.filter(p => p.userId === userInfo.userId);
                users.push({...userInfo, postCount: userPosts.length});
                if (user.followings.includes(userInfo.userId)) {
                    friends.push({...userInfo, postCount: userPosts.length});
                }
            }
        });

        if (this.mounted) {
            this.setState({data: users, friends: friends});
        } else {
            this.state.data = users;
            this.state.friends = friends;
        }

        this.search();
    }


    onSearchChangeText = (text) => {
        this.setState({text: text.trim(), loading: false});
        this.search();
    };

    search = debounce(async () => {
        const {text, data, friends} = this.state;
        // Search
        if (text.length > 0) {
            let searchData = data.filter(d => {
                const key = d.displayName;
                return key.toLowerCase().indexOf(text.toLowerCase()) >= 0;
            });
            this.setState({searchData, loading: false, refreshing: false});
        } else {
            this.setState({searchData: data, loading: false, refreshing: false});
        }
    }, 200);

    onToggleFollow = (item, following) => {
        const {user, setUser} = this.props;
        this.setState({updating: true});
        firebaseSdk.updateFollows(user.id, item.id, following?DB_ACTION_DELETE: DB_ACTION_ADD)
            .then(({myFollowings}) => {
                if(!following){
                    const activity = {
                        type: NOTIFICATION_TYPE_FOLLOW,
                        sender: user.userId,
                        receiver: item.userId,
                        content: '',
                        postId: null,
                        title: item.displayName,
                        message: I18n.t(`follows_you`, {name: user.displayName}),
                        date: new Date()
                    }
                    firebaseSdk.addActivity(activity, item.token).then(r => {});
                }
                setUser({followings: myFollowings});
                this.setState({updating: false});
            })
            .catch(err => {
                this.setState({updating: false});
            })
    }

    onPressItem = (item) => {
        const {navigation} = this.props;
        console.log('item', item);
        navigation.push('OtherProfile', {userId: item.userId});
    }

    renderItem = ({item}) => {
        const { user, theme } = this.props;
        let following = user.followings.includes(item.userId);
        return (
            <TouchableOpacity onPress={() => this.onPressItem(item)} style={styles.itemContainer}>
                <View style={styles.itemHeader}>
                    <Image source={item.avatar ? {uri: item.avatar} : images.default_avatar}
                           style={styles.itemImage}/>
                    <View style={styles.itemContent}>
                        <Text style={styles.itemText}>{item.displayName}</Text>
                        <Text>{item.postCount} posts</Text>
                    </View>
                </View>
                <TouchableOpacity onPress={() => this.onToggleFollow(item, following)}>
                    {
                        following?
                        <ImageBackground style={styles.itemAction} source={images.following}>
                            <Text style={[styles.actionText, {color: themes[theme].sideTitleText}]}>{I18n.t('Following')}</Text>
                        </ImageBackground>
                            :
                            <VectorIcon color={'grey'} name={'adduser'} type={'AntDesign'} size={32}/>
                    }
                </TouchableOpacity>
            </TouchableOpacity>
        );
    }

    renderFooter = () => {
        const { loading } = this.state;
        const { theme } = this.props;
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
        const {navigation, theme} = this.props;
        const {searchData, refreshing, updating} = this.state;
        console.log('searchData', searchData);
        return (
            <PageContainer
                navigation={navigation}
                hasSearch
                title={I18n.t('Find_friend')}
                onSearchChangeText={this.onSearchChangeText}
                onSearch={this.search}
              >
                <StatusBar/>
                {updating && <ActivityIndicator absolute theme={theme} size={'large'}/>}
                <View style={[styles.container, {marginTop: 100 + getStatusBarHeight(true)}]}>
                    {searchData.length > 0 &&
                        <FlatList
                            data={searchData}
                            renderItem={this.renderItem}
                            keyExtractor={item => item.userId}
                            ListFooterComponent={this.renderFooter}
                            ItemSeparatorComponent={() => <View style={sharedStyles.listSeparator} />}
                            refreshControl={(
                                <RefreshControl
                                    refreshing={refreshing}
                                    onRefresh={this.onRefresh}
                                    tintColor={themes[theme].actionColor}
                                />
                            )}
                        />
                    }
                </View>
            </PageContainer>
        )
    }
}

const mapStateToProps = state => ({
    user: state.login.user
})

const mapDispatchToProps = dispatch => ({
    setUser: params => dispatch(setUserAction(params))
})

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(FriendView));
