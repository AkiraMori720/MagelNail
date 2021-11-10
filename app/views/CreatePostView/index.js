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
import {showErrorAlert, showToast} from "../../lib/info";
import {setUser as setUserAction} from "../../actions/login";
import * as HeaderButton from '../../containers/HeaderButton';
import CsTextInput from '../../containers/CsTextInput';
import ActivityIndicator from '../../containers/ActivityIndicator';
import {POST_TYPE_PHOTO, POST_TYPE_TEXT, POST_TYPE_VIDEO} from '../../constants/app';
import Video from 'react-native-video';
import firebaseSdk, {DB_ACTION_ADD} from '../../lib/firebaseSdk';
import { createThumbnail } from "react-native-create-thumbnail";
import I18n from '../../i18n';
import {VectorIcon} from '../../containers/VectorIcon';
import PageContainer from "../../containers/PageContainer";
import {getStatusBarHeight} from "../../utils/statusbar";

class CreatePostView extends React.Component{

    static propTypes = {
        navigation: PropTypes.object,
        user: PropTypes.object,
        setUser: PropTypes.func,
        theme: PropTypes.string
    }

    constructor(props) {
        super(props);
        const type = props.route.params?.type??POST_TYPE_TEXT;
        const file_path = props.route.params?.file_path;
        this.mounted = false;
        this.state = {
            type,
            file_path,
            thumbnail: null,
            playing: false,
            text: '',
            isLoading: true,
        }
        this.init();
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

    init = async () => {
        if(this.state.type === POST_TYPE_VIDEO){
            createThumbnail({ url: this.state.file_path, timestamp: 100 }).then(thumbnail => {
                this.setSafeState({isLoading: false, thumbnail: thumbnail.path});
                console.log('thumbnail', thumbnail);
            });
        } else {
            this.setSafeState({isLoading: false});
        }
    }

    isValid = () => {
        const {text, type} = this.state;
        if(type=== POST_TYPE_TEXT && !text.length){
            showToast(I18n.t('please_enter_post_text'));
            this.textInput.focus();
            return false;
        }
        return true;
    }


    onSubmit = () => {
        if(this.isValid()){
            const {file_path, thumbnail, type, text} = this.state;
            const {user} = this.props;
            this.setState({isLoading: true});

            let post = {
                userId: user.userId,
                likes: [],
                comments: [],
                type: type,
                text: text.length > 0?text:null,
                date: new Date()
            }

            switch (type){
                case POST_TYPE_TEXT:
                    return this.savePost(post);
                case POST_TYPE_PHOTO:
                    return  firebaseSdk.uploadMedia(firebaseSdk.STORAGE_TYPE_PHOTO, file_path)
                                .then(image_url => {
                                    post.photo = image_url;
                                    this.savePost(post);
                                }).catch(err => {
                                    showErrorAlert(I18n.t('Upload_Image_failed'));
                                    this.setState({isLoading: false});
                                });
                case POST_TYPE_VIDEO:
                    return  firebaseSdk.uploadMedia(firebaseSdk.STORAGE_TYPE_PHOTO, file_path)
                        .then(video_url => {
                            post.video = video_url;
                            firebaseSdk.uploadMedia(firebaseSdk.STORAGE_TYPE_PHOTO, thumbnail)
                                .then(image_url => {
                                    post.thumbnail = image_url;
                                    this.savePost(post);
                                }).catch(err => {
                                    showErrorAlert(I18n.t('Uploading_thumbnail_failed'));
                                    this.setState({isLoading: false});
                                });
                        }).catch(err => {
                            showErrorAlert(I18n.t('Upload_Image_failed'));
                            this.setState({isLoading: false});
                        });

            }

        }
    }

    savePost = (post) => {
        const {navigation} = this.props;
        firebaseSdk.setData(firebaseSdk.TBL_POST, DB_ACTION_ADD, post)
            .then(() => {
                showToast(I18n.t('Publish_post_complete'));
                this.setState({isLoading: false});
                navigation.popToTop();
            })
            .catch(() => {
                showErrorAlert(I18n.t('Publish_post_failed'));
                this.setState({isLoading: false});
            })
    }

    renderForm = () => {
        const {type, text, file_path, thumbnail, playing} = this.state;
        const {theme} = this.props;
        switch (type){
            case POST_TYPE_TEXT:
                return (
                    <View style={styles.inputContainer}>
                        <CsTextInput
                            inputRef={(e) => {
                                this.textInput = e;
                            }}
                            containerStyle={styles.roundInput}
                            inputStyle={styles.textStyle}
                            wrapStyle={{alignItems: 'flex-start', paddingVertical: 12}}
                            returnKeyType='send'
                            keyboardType='default'
                            onChangeText={text => this.setState({text})}
                            multiline={true}
                            theme={theme}
                        />
                    </View>
                );
            case POST_TYPE_PHOTO:
                return (
                    <View style={styles.inputContainer}>
                        <CsTextInput
                            inputRef={(e) => {
                                this.textInput = e;
                            }}
                            containerStyle={styles.underlineInput}
                            placeholder={I18n.t('Photo_post_placeholder')}
                            returnKeyType='send'
                            keyboardType='default'
                            onChangeText={text => this.setState({text})}
                            theme={theme}
                        />
                        <Image source={{uri: file_path}} style={styles.imageStyle}/>
                    </View>
                )
            case POST_TYPE_VIDEO:
                return (
                    <View style={styles.inputContainer}>
                        {   playing &&
                            <Video
                                source={{uri: file_path}}
                                style={styles.video}
                                controls
                                onEnd={() => this.setState({playing: false})}
                                resizeMode={'contain'}/>
                        }
                        {
                            thumbnail && !playing &&
                            <View style={styles.thumbnailContainer}>
                                <Image
                                    source={{uri: thumbnail}}
                                    style={styles.thumbnail}
                                    resizeMode={'contain'}
                                />
                                <TouchableOpacity onPress={() => this.setState({playing: true})} style={[styles.playIcon, { position: 'absolute' }]}>
                                    <VectorIcon
                                        name='playcircleo'
                                        type={'AntDesign'}
                                        size={72}
                                        color={'white'}
                                    />
                                </TouchableOpacity>
                            </View>
                        }
                        <CsTextInput
                            inputRef={(e) => {
                                this.textInput = e;
                            }}
                            containerStyle={styles.underlineInput}
                            placeholder={I18n.t('Video_post_placeholder')}
                            returnKeyType='send'
                            keyboardType='default'
                            onChangeText={text => this.setState({text})}
                            multiline={true}
                            theme={theme}
                        />
                    </View>
                )
        }
        return null;
    }

    render(){
        const {navigation, user, theme} = this.props;
        const {text, isLoading} = this.state;
        return (
            <PageContainer
                navigation={navigation}
                title={I18n.t('Create_post')}
                headerRight={() => <HeaderButton.Publish navigation={navigation} onPress={this.onSubmit} />}
            >
                <StatusBar/>
                <KeyboardView
                    contentContainerStyle={sharedStyles.container}
                    keyboardVerticalOffset={128}
                >
                    <ScrollView contentContainerStyle={{flexGrow: 1, paddingTop: 52 + getStatusBarHeight(true)}} {...scrollPersistTaps}>
                        {
                            isLoading && <ActivityIndicator absolute theme={theme} size={'large'}/>
                        }
                        <View style={styles.userContainer}>
                            <Image source={user.avatar ? {uri: user.avatar} : images.default_avatar}
                                   style={styles.userImage}/>
                            <Text style={styles.userName}>{user.displayName}</Text>
                        </View>
                        { this.renderForm() }
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

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(CreatePostView));
