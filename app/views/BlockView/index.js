import React from 'react';
import PropTypes from "prop-types";
import {HEADER_BAR_END, HEADER_BAR_START, themes} from '../../constants/colors';
import StatusBar from "../../containers/StatusBar";
import {withTheme} from "../../theme";
import {FlatList, Image, RefreshControl, Text, TouchableOpacity, View} from 'react-native';
import styles from "./styles";
import {setUser as setUserAction} from "../../actions/login";
import images from "../../assets/images";
import firestore from "@react-native-firebase/firestore";
import firebaseSdk, {DB_ACTION_UPDATE} from '../../lib/firebaseSdk';
import {connect} from "react-redux";
import ActivityIndicator from "../../containers/ActivityIndicator";
import sharedStyles from '../Styles';
import * as HeaderButton from '../../containers/HeaderButton';
import I18n from '../../i18n';
import LinearGradient from 'react-native-linear-gradient';
import PageContainer from "../../containers/PageContainer";
import {getStatusBarHeight} from "../../utils/statusbar";

class BlockView extends React.Component {
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
            unBlocked: [],
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

        const block_list = [];
        userSnaps.forEach(s => {
            const userInfo = {...s.data(), id: s.id};
            if(userInfo.userId !== user.userId){
                if (user.blocked && user.blocked.includes(userInfo.userId)) {
                    block_list.push(userInfo);
                }
            }
        });

        if (this.mounted) {
            this.setState({data: block_list, loading: false});
        } else {
            this.state.data = block_list;
            this.state.loading = false;
        }
        console.log('block list', block_list);
    }

    toggleUnBlock = (item) => {
        const {unBlocked} = this.state;
        if(unBlocked.includes(item.userId)){
            this.setState({unBlocked: unBlocked.filter(b => b!== item.userId)});
        } else {
            this.setState({unBlocked: [...unBlocked, item.userId]});
        }
    }

    onUnBlock = () => {
        const {user, setUser} = this.props;
        const {unBlocked} = this.state;

        if(!user.blocked){
            return;
        }

        let blocked = user.blocked.filter(b => !unBlocked.includes(b));
        let update = {id: user.id, blocked};

        this.setState({updating: true});
        firebaseSdk.setData(firebaseSdk.TBL_USER, DB_ACTION_UPDATE, update)
            .then(() => {
                setUser({blocked: blocked});
                this.setState({updating: false});
                this.init();
            })
            .catch(err => {
                this.setState({updating: false});
            })
    }
    //
    // onPressItem = (item) => {
    //     const {navigation} = this.props;
    //     console.log('item', item);
    //     navigation.push('Profile', {userId: item.userId});
    // }

    renderItem = ({item}) => {
        let unBlocked = this.state.unBlocked.includes(item.userId);
        return (
            <View style={styles.itemContainer}>
                <View style={styles.itemHeader}>
                    <Image source={item.avatar ? {uri: item.avatar} : images.default_avatar}
                           style={styles.itemImage}/>
                    <View style={styles.itemContent}>
                        <Text style={styles.itemText}>{item.displayName}</Text>
                        <Text>{0} posts</Text>
                    </View>
                </View>
                <TouchableOpacity onPress={() => this.toggleUnBlock(item)}>
                    <Text style={unBlocked?styles.blockText:styles.unBlockText}>{unBlocked?'Block': '✓ Unblock'}</Text>
                </TouchableOpacity>
            </View>
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
        const {data, refreshing, updating} = this.state;

        return (
            <PageContainer
                navigation={navigation}
                title={I18n.t('Blocked')}
                headerRight={() => <HeaderButton.Complete navigation={navigation} onPress={this.onUnBlock} testID='rooms-list-view-create-channel'/>}
            >
                <StatusBar/>
                <LinearGradient colors={[HEADER_BAR_START, HEADER_BAR_END]} style={sharedStyles.topLinearGradient} angle={90} useAngle/>
                {updating && <ActivityIndicator absolute theme={theme} size={'large'}/>}
                <View style={[styles.container, {paddingTop: 52 + getStatusBarHeight(true)}]}>
                    {data.length > 0 &&
                        <FlatList
                            data={data}
                            renderItem={this.renderItem}
                            keyExtractor={item => item.userId}
                            ListFooterComponent={this.renderFooter}
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

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(BlockView));
