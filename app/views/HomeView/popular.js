import React from 'react';
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {FlatList, ImageBackground, RefreshControl, Text} from 'react-native';

import {themes} from "../../constants/colors";
import StatusBar from "../../containers/StatusBar";
import {withTheme} from "../../theme";
import {withDimensions} from "../../dimensions";
import ActivityIndicator from "../../containers/ActivityIndicator";
import firestore from '@react-native-firebase/firestore';
import firebaseSdk, {DB_ACTION_UPDATE, NOTIFICATION_TYPE_LIKE} from '../../lib/firebaseSdk';
import Post from './Post';
import styles from '../ChatView/styles';
import images from '../../assets/images';
import SafeAreaView from '../../containers/SafeAreaView';
import {GradientHeader} from '../../containers/GradientHeader';

class PopularView extends React.Component {
    static navigationOptions = ({navigation}) => ({
        title: 'Popular Posts',
        headerBackground: () => <GradientHeader/>
    })

    static propTypes = {
        user: PropTypes.object,
        theme: PropTypes.string,
        width: PropTypes.number,
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
            notifying: false
        }

        this.init();
    }

    componentDidMount() {
        this.mounted = true;
    }

    init = async () => {
        const {user} = this.props;
        let querySnapShot = await firestore().collection(firebaseSdk.TBL_POST).get();

        const userSnaps = await firestore().collection(firebaseSdk.TBL_USER).get();
        const users = [];
        userSnaps.forEach(s => users.push(s.data()));

        let list = [];
        querySnapShot.forEach(doc => {
            const post = doc.data();
            if(!user.blocked || !user.blocked.includes(post.userId)){
                const owner = users.find(u => u.userId === post.userId);
                list.push({id: doc.id, ...post, owner});
            }
        });
        list.sort((a, b) => b.date - a.date);
        if (this.mounted) {
            this.setState({data: list});
        } else {
            this.state.data = list;
        }
        console.log('list', list, users);
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

    onActionPost = (item) => {

    }

    renderFooter = () => {
        const {loading} = this.state;
        const {theme} = this.props;
        if (loading) {
            return <ActivityIndicator theme={theme} size={'large'}/>;
        }
        return null;
    }

    render() {
        const {user, theme} = this.props;
        const {
            data,
            loading,
            refreshing,
        } = this.state;

        return (
            <ImageBackground style={styles.mainContainer} source={images.bg_splash_onboard}>
                <SafeAreaView style={{flex: 1}}>
                <StatusBar/>
                {((data.length > 0) || loading) ?
                    <FlatList
                        style={{flexGrow: 1, marginBottom: 40}}
                        data={data}
                        renderItem={({item, index}) =>
                            <Post
                                key={index}
                                item={item}
                                onPressUser={() => this.onOpenProfile(item)}
                                onPress={() => this.onOpenPost(item)}
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
                    <Text style={styles.noPosts}>No Popular Posts</Text>
                }
                </SafeAreaView>
            </ImageBackground>
        )
    }
}

const mapStateToProps = state => ({
    user: state.login.user
})

export default connect(mapStateToProps, null)(withTheme(withDimensions(PopularView)));
