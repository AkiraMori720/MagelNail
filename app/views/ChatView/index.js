import React from 'react';
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {
    FlatList,
    Image, NativeModules, RefreshControl,
    TextInput,
    TouchableOpacity,
    SafeAreaView as RNSafeAreaView, View, Text
} from 'react-native';
import firestore from "@react-native-firebase/firestore";
import {KeyboardAccessoryView} from 'react-native-ui-lib/keyboard';
import moment from "moment";

import {themes} from '../../constants/colors';
import StatusBar from "../../containers/StatusBar";
import {withTheme} from "../../theme";
import styles from "./styles";
import images from "../../assets/images";
import firebaseSdk from "../../lib/firebaseSdk";
import {showErrorAlert} from "../../lib/info";
import {withSafeAreaInsets} from "react-native-safe-area-context";
import {BorderlessButton} from 'react-native-gesture-handler';
import Message from './Message';
import {checkCameraPermission, checkPhotosPermission, imagePickerConfig} from '../../utils/permissions';
import ImagePicker from 'react-native-image-crop-picker';
import ActivityIndicator from '../../containers/ActivityIndicator';
import {isIOS} from '../../utils/deviceInfo';
import PageContainer from "../../containers/PageContainer";
import debounce from "../../utils/debounce";
import database from "@react-native-firebase/database";
import SoundPlayer from "react-native-sound-player";

const scrollPersistTaps = {
    keyboardShouldPersistTaps: 'always',
    keyboardDismissMode: 'interactive'
};

class ChatView extends React.Component {
    static propTypes = {
        user: PropTypes.object,
        insets: PropTypes.object,
        theme: PropTypes.string,
    }

    constructor(props) {
        super(props);
        const room = props.route.params?.room;
        this.mounted = false;
        this.state = {
            loading: false,
            messages: [],
            room: room,
            inputText: '',
            showActiveImage: false,
            refreshing: false,
            sending: false,
            otherTyping: false
        }
        console.log('room', room);
        this.init();
        this.canSoundPlay = false;
        this._finishedLoadingFileLister = SoundPlayer.addEventListener('FinishedLoadingFile', () => {
            this.canSoundPlay = true;
        })
        this._finishedLoadingLister = SoundPlayer.addEventListener('FinishedLoading', () => {
            this.canSoundPlay = true;
        })
        this._finishedPlayingLister = SoundPlayer.addEventListener('FinishedPlaying', () => {
            this.canSoundPlay = true;
        })
        SoundPlayer.loadSoundFile('chat', 'caf');
    }


    componentDidMount() {
        this.mounted = true;
        firebaseSdk.onOnline(this.state.room.id, this.props.user.userId);
    }

    async componentWillUnmount() {
        const {room} = this.state;
        const {user} = this.props;

        if(this.unSubscribeMessage){
            this.unSubscribeMessage();
        }
        if(this._finishedLoadingFileLister){
            this._finishedLoadingFileLister.remove();
        }
        if(this._finishedLoadingLister){
            this._finishedLoadingLister.remove();
        }
        if(this._finishedPlayingLister){
            this._finishedPlayingLister.remove();
        }
        try{
            await this.setUnReads();
            firebaseSdk.onOffline(room.id, user.userId);
            firebaseSdk.typing(room.id, user.userId, false);
        } catch (e) {
            console.log('leftRoom Error', e);
        }
    }

    setUnReads = async () => {
        const {room} = this.state;
        const {user} = this.props;
        if(room.confirmUser === user.userId){
            await firestore().collection(firebaseSdk.TBL_ROOM).doc(room.id).update({confirmUser: "", unReads: 0});
        }
    }

    init = async () => {
        const {room} = this.state;
        const {user} = this.props;
        await this.setUnReads();

        if(this.unSubscribeMessage){
            this.unSubscribeMessage();
        }

        let messagesSubscribe = await firestore().collection(firebaseSdk.TBL_MESSAGE);
        this.unSubscribeMessage = messagesSubscribe.onSnapshot(async(querySnapShot) => {
            const userSnaps = await firestore().collection(firebaseSdk.TBL_USER).get();
            const users = [];
            userSnaps.forEach(s => users.push(s.data()));

            let list = [];
            querySnapShot.forEach(doc => {
                const message = doc.data();
                const isOwn = message.sender === user.userId;
                if(message.roomId === room.id){
                    list.push({
                        id: doc.id,
                        msg: message.message,
                        photo: message.photo,
                        createdAt: moment(message.date.seconds * 1000),
                        isOwn,
                        owner: (isOwn?
                            {userId: user.userId, name: user.displayName, avatar: user.avatar}
                            :{userId: room.account.userId, name: room.account.displayName, avatar: room.account.avatar}
                        )
                    });
                }
            });

            list.sort((a, b) => b.createdAt - a.createdAt);
            if(this.state.messages.length > 0 && this.state.messages.length !== list.length){
                this.playSound();
            }
            if(this.mounted){
                this.setState({messages: list});
            } else {
                this.state.messages = list;
            }
            console.log('messages', list);
        });

        const typingRef = database().ref('rooms/' + room.id + '/typing/' + room.account.userId);
        typingRef.on("value", (snapshot) => {
            const otherTyping = snapshot.val();
            this.setState({otherTyping});
        });
    }

    sendMessage = async() => {
        const {room, inputText} = this.state;
        const {user} = this.props;

        this.input.setNativeProps({text: ''});
        this.handleTyping(false);
        if(inputText.trim().length === 0){
            return;
        }
        let text = inputText.trim();
        this.setState({inputText: ''});
        try {
            let message = {
                    roomId: room.id,
                    message: text,
                    date: new Date(),
                    sender: user.userId,
                    receiver: room.account.userId
                };
            await firebaseSdk.saveMessage(room.id, message, user, room.account);
        }catch (e) {
            console.log('error', e);
            showErrorAlert('Sending Message Failed.');
        }
    }

    onChangeText = debounce(async (text) => {
        const isTextEmpty = text.length === 0;
        this.handleTyping(!isTextEmpty);
        this.setState({inputText: text});
    }, 100)

    handleTyping = (isTyping) => {
        const {room} = this.state;
        const {user} = this.props;
        if(!isTyping){
            if(this.typingTimeout){
                clearTimeout(this.typingTimeout);
                this.typingTimeout = false;
            }
            firebaseSdk.typing(room.id, user.userId, false);
            return;
        }

        if(this.typingTimeout){
            return;
        }

        this.typingTimeout = setTimeout(() => {
            firebaseSdk.typing(room.id, user.userId, true);
            this.typingTimeout = false;
        }, 1000);
    }

    sendMediaMessage = async(image_path) => {
        const {room} = this.state;
        const {user} = this.props;
        try {
            this.setState({sending: true});
            const image_url = await firebaseSdk.uploadMedia(firebaseSdk.STORAGE_TYPE_PHOTO, image_path);

            let message = {
                roomId: room.id,
                message: 'photo',
                photo: image_url,
                date: new Date(),
                sender: user.userId,
                receiver: room.account.userId
            };

            await firebaseSdk.saveMessage(room.id, message, user, room.account);
            this.setState({sending: false});
        }catch (e) {
            console.log('error', e);
            showErrorAlert('Sending Message Failed.');
            this.setState({sending: false});
        }
    }

    onUploadPhoto = async () => {
        if(await checkCameraPermission()){
            ImagePicker.openCamera(imagePickerConfig).then(image => {
                this.sendMediaMessage(image.path);
            });
        }
    }

    onUploadImage = async () => {
        if(await checkPhotosPermission()) {
            ImagePicker.openPicker(imagePickerConfig).then(image => {
                this.sendMediaMessage(image.path);
            });
        }
    }

    playSound = () => {
        if(this.canSoundPlay){
            this.canSoundPlay = false;
            SoundPlayer.play();
            console.log('play sound');
        }
    }

    leftButtons = () => {
        const { theme } = this.props;

        return (
            <>
                <BorderlessButton
                    key='file-message'
                    onPress={ this.onUploadPhoto }
                    style={ styles.actionButtonContainer }
                    testID='messagebox-action-upload-photo'
                >
                    <Image style={ styles.actionButtonPhoto } source={images.upload_photo}/>
                </BorderlessButton>
                <BorderlessButton
                    key='file-message'
                    onPress={ this.onUploadImage }
                    style={ styles.actionButtonContainer }
                    testID='messagebox-action-upload-image'
                >
                    <Image style={ styles.actionButtonImage } source={images.upload_image}/>
                </BorderlessButton>
            </>
        );
    }

    renderInput = () => {
        const {theme} = this.props;
        return (
            <RNSafeAreaView style={{backgroundColor: themes[theme].headerBackground}}>
                <View style={styles.inputContainer}>
                    {this.leftButtons()}
                    <TextInput
                        ref={(r) => this.input = r}
                        returnKeyType={'default'}
                        keyboardType='default'
                        multiline
                        blurOnSubmit={true}
                        placeholder='Enter a Message'
                        onChangeText={this.onChangeText}
                        onSubmitEditing={() => this.sendMessage()}
                        style={[styles.input, {backgroundColor: themes[theme].backgroundColor}]}
                    />
                    <TouchableOpacity style={styles.btnContainer} onPress={this.sendMessage}>
                        <Image source={images.ic_send} style={styles.sendBtn}/>
                    </TouchableOpacity>
                </View>
            </RNSafeAreaView>
        )
    }

    onRefresh = () => this.setState({refreshing: true}, async () => {
        await this.init();
        this.setState({ refreshing: false });
    });

    onPressMedia = (message) => {
        this.setState({showActiveImage: message.photo});
    }

    renderItem = (item, prevItem, index) => {
        let dateSeparator = null;
        if(!prevItem){
            dateSeparator = item.createdAt;
        } else if(!moment(item.createdAt).isSame(prevItem.createdAt, 'day')){
            dateSeparator = item.createdAt;
        }
        const message =
            <Message
                key={item.id}
                onPressMedia={() => this.onPressMedia(item)}
                item={item}/>;

        if(dateSeparator){
            return (
                <>
                    {message}
                    <View style={styles.dateSeparator}>
                        <Text style={styles.dateSepText}>{moment(dateSeparator).format('LL')}</Text>
                    </View>
                </>
            )
        }
        return message;
    }

    renderTyping = () => {
        const {otherTyping} = this.state;
        if(otherTyping){
            return (<Text style={styles.typing}>入力中...</Text>)
        }
        return null;
    }

    render() {
        const {navigation, theme} = this.props;
        const {messages, refreshing, sending, showActiveImage, room} = this.state;
        return (
            <PageContainer
                navigation={navigation}
                title={`${room.account?.displayName}`}
                >
                <StatusBar/>
                {sending && <ActivityIndicator absolute theme={theme} size={'large'}/>}
                <FlatList
                    style={{flex: 1}}
                    data={messages}
                    renderItem={({item, index}) => this.renderItem(item, messages[index + 1], index)}
                    keyExtractor={item => item.id}
                    inverted
                    removeClippedSubviews={isIOS}
                    contentContainerStyle={{paddingTop: 4}}
                    refreshControl={(
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={this.onRefresh}
                            tintColor={themes[theme].actionColor}
                        />
                    )}
                    ListHeaderComponent={this.renderTyping}
                    {...scrollPersistTaps}
                />
                <KeyboardAccessoryView
                    ref={ref => this.tracking = ref}
                    key='input'
                    renderContent={this.renderInput}
                    requiresSameParentToManageScrollView
                    addBottomView
                    iOSScrollbehavior={NativeModules.KeyboardTrackingViewManager?.keyboardTrackingScrollBehaviorFixedOffset}
                />
                {
                    showActiveImage &&
                        <TouchableOpacity style={styles.activeImageContainer} onPress={() => this.setState({showActiveImage: null})}>
                            <Image source={{uri: showActiveImage}} style={styles.activeImage}/>
                        </TouchableOpacity>
                }
            </PageContainer>
        )
    }
}

const mapStateToProps = state => ({
    user: state.login.user
})

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(withSafeAreaInsets(withTheme(ChatView)));
