import React from 'react';
import PropTypes from "prop-types";
import {themes} from "../../constants/colors";
import StatusBar from "../../containers/StatusBar";
import {withTheme} from "../../theme";
import {FlatList, Image, RefreshControl, Text, TouchableOpacity, View} from 'react-native';
import styles from "./styles";
import {setUser as setUserAction} from "../../actions/login";
import images from "../../assets/images";
import firestore from "@react-native-firebase/firestore";
import {connect} from "react-redux";
import ActivityIndicator from "../../containers/ActivityIndicator";
import MainScreen from '../../containers/MainScreen';
import firebaseSdk, {
    NOTIFICATION_TYPE_COMMENT,
    NOTIFICATION_TYPE_FOLLOW,
    NOTIFICATION_TYPE_LIKE,
} from '../../lib/firebaseSdk';
import sharedStyles from "../Styles";
import {VectorIcon} from '../../containers/VectorIcon';
import NoActivity from './NoActivity';
import I18n from '../../i18n';
import * as HeaderButton from "../../containers/HeaderButton";
import {getStatusBarHeight} from "../../utils/statusbar";

class ActivityView extends React.Component {
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
            refreshing: false,
            loading: true
        }
        this.init();
    }

    componentDidMount() {
        this.mounted = true;
    }

    init = async () => {
        const {user} = this.props;
        const querySnapShot = await firestore().collection(firebaseSdk.TBL_ACTIVITY).get();
        const userSnaps = await firestore().collection(firebaseSdk.TBL_USER).get();
        const users = [];
        userSnaps.forEach(s => users.push(s.data()));

        let list = [];
        querySnapShot.forEach(doc => {
            const activity = doc.data();
            if(activity.receiver === user.userId && (!user.blocked || !user.blocked.includes(activity.sender))){
                const sender = users.find(u => u.userId === activity.sender);
                list.push({id: doc.id, ...activity, sender});
            }
        });

        list.sort((a, b) => b.date - a.date);
        if (this.mounted) {
            this.setState({data: list, loading: false, refreshing: false});
        } else {
            this.state.data = list;
            this.state.loading = false;
            this.state.refreshing = false;
        }
        console.log('list', list);
    }


    onPressItem = (item) => {
        const {navigation} = this.props;
        switch (item.type){
            case NOTIFICATION_TYPE_COMMENT:
            case NOTIFICATION_TYPE_LIKE:
                return navigation.push('PostDetail', {post: {id: item.postId}});
            case NOTIFICATION_TYPE_FOLLOW:
                return navigation.push('OtherProfile', {userId: item.sender.userId});
        }
    }

    renderItem = ({item}) => {
        const { user } = this.props;
        let message = '';
        switch (item.type){
            case NOTIFICATION_TYPE_COMMENT:
                message = I18n.t('commented_in_your_post', {name: ''});
                break;
            case NOTIFICATION_TYPE_LIKE:
                message = I18n.t('likes_your_post', {name: ''});
                break;
            case NOTIFICATION_TYPE_FOLLOW:
                message = I18n.t('follows_you', {name: ''});
                break;
        }

        return (
            <TouchableOpacity onPress={() => this.onPressItem(item)} style={styles.itemContainer}>
                <Image source={item.sender.avatar ? {uri: item.sender.avatar} : images.default_avatar}
                       style={styles.itemImage}/>
                <View style={styles.itemContent}>
                    <Text style={styles.itemTitle}>{item.sender.displayName}</Text>
                    <Text style={styles.itemText} ellipsizeMode={"tail"} numberOfLines={1}>{message}</Text>
                </View>
                {
                    item.postImage ?
                        <View style={styles.postImageContainer}>
                            <Image source={{uri: item.postImage}} style={styles.postImages}/>
                            {
                                item.postType === 'video'?
                                    <VectorIcon name='playcircleo' type={'AntDesign'} size={12} color={'white'} style={styles.playIcon}/>
                                    :null
                            }
                        </View>
                        : null
                }
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

    renderSeparator = () => <View style={sharedStyles.listSeparator} />

    render() {
        const {theme, navigation} = this.props;
        const {data, refreshing} = this.state;

        return (
            <MainScreen
                navigation={navigation}
                headerLeft={() => <HeaderButton.Drawer navigation={navigation} testID='nav-drawer' />}
            >
                <StatusBar/>
                <View style={[styles.container, {paddingTop: 100 + getStatusBarHeight(true)}]}>
                    { data.length > 0 ?
                        <FlatList
                            data={data}
                            renderItem={this.renderItem}
                            keyExtractor={item => item.userId}
                            ListFooterComponent={this.renderFooter}
                            ItemSeparatorComponent={this.renderSeparator}
                            refreshControl={(
                                <RefreshControl
                                    refreshing={refreshing}
                                    onRefresh={this.onRefresh}
                                    tintColor={themes[theme].actionColor}
                                />
                            )}
                        />
                    :
                        <NoActivity onPress={() => {}}/>
                    }
                </View>
            </MainScreen>
        )
    }
}

const mapStateToProps = state => ({
    user: state.login.user
})

const mapDispatchToProps = dispatch => ({
    setUser: params => dispatch(setUserAction(params))
})

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(ActivityView));
