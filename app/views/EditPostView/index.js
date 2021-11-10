import React from 'react';
import PropTypes from 'prop-types';
import {Alert, Image, ImageBackground, ScrollView, TouchableOpacity, View} from 'react-native';
import {connect} from "react-redux";

import {withTheme} from "../../theme";
import KeyboardView from "../../containers/KeyboardView";
import sharedStyles from "../Styles";
import StatusBar from "../../containers/StatusBar";
import styles from "./styles";
import images from "../../assets/images";
import scrollPersistTaps from "../../utils/scrollPersistTaps";
import SafeAreaView from "../../containers/SafeAreaView";
import {showErrorAlert, showToast} from "../../lib/info";
import {setUser as setUserAction} from "../../actions/login";
import * as HeaderButton from '../../containers/HeaderButton';
import CsTextInput from '../../containers/CsTextInput';
import ActivityIndicator from '../../containers/ActivityIndicator';
import {POST_TYPE_PHOTO, POST_TYPE_TEXT, POST_TYPE_VIDEO} from '../../constants/app';
import Video from 'react-native-video';
import firebaseSdk, {DB_ACTION_ADD, DB_ACTION_UPDATE} from '../../lib/firebaseSdk';
import I18n from '../../i18n';
import {VectorIcon} from '../../containers/VectorIcon';
import {GradientHeader} from '../../containers/GradientHeader';
import LinearGradient from 'react-native-linear-gradient';
import {HEADER_BAR_END, HEADER_BAR_START} from '../../constants/colors';
import firestore from '@react-native-firebase/firestore';
import {
    checkCameraPermission,
    checkPhotosPermission,
    imagePickerConfig, libraryVideoPickerConfig,
    videoPickerConfig,
} from '../../utils/permissions';
import ImagePicker from 'react-native-image-crop-picker';
import {createThumbnail} from 'react-native-create-thumbnail';
import PageContainer from "../../containers/PageContainer";
import {getStatusBarHeight} from "../../utils/statusbar";

class EditPostView extends React.Component{

    static propTypes = {
        navigation: PropTypes.object,
        user: PropTypes.object,
        setUser: PropTypes.func,
        theme: PropTypes.string
    }

    constructor(props) {
        super(props);
        const postId = props.route.params?.postId;
        this.mounted = false;
        this.state = {
            postId,
            type: POST_TYPE_TEXT,
            file_path: null,
            thumbnail: null,
            photo: null,
            video: null,
            playing: false,
            text: '',
            isLoading: true,
        }
    }

    componentDidMount() {
        const { navigation } = this.props;
        firestore().collection(firebaseSdk.TBL_POST).doc(this.state.postId).get()
            .then(docSnapshot => {
                const post = docSnapshot.data();
                this.setSafeState({
                    type: post.type,
                    text: post.text,
                    thumbnail: post.thumbnail,
                    photo: post.photo,
                    video: post.video,
                    isLoading: false
                });
                if(this.textInput){
                    this.textInput.setNativeProps({text: post.text});
                }
            })
            .catch(err => {
                this.setSafeState({isLoading: false});
                showErrorAlert('Post not found.', '', () => navigation.pop());
            })
        this.mounted = true;
    }

    setSafeState(states){
        if(this.mounted){
            this.setState(states);
        } else {
            this.state = {...this.state, ...states};
        }
    }

    takePhoto = async () => {
        if(await checkCameraPermission()){
            ImagePicker.openCamera(imagePickerConfig).then(image => {
                this.setState({file_path: image.path});
            });
        }
    }


    takeVideo = async () => {
        if(await checkCameraPermission()){
            ImagePicker.openCamera(videoPickerConfig).then(video => {
                this.setState({file_path: video.path});
                this.takeThumbnail();
            });
        }
    }


    choosePhoto = async () => {
        if(await checkPhotosPermission()) {
            ImagePicker.openPicker(imagePickerConfig).then(image => {
                this.setState({file_path: image.path});
            });
        }
    }

    chooseVideo = async () => {
        if(await checkPhotosPermission()) {
            ImagePicker.openPicker(libraryVideoPickerConfig).then(video => {
                this.setState({file_path: video.path});
                this.takeThumbnail();
            });
        }
    }

    takeThumbnail = () => {
        this.setState({isLoading: true});
        createThumbnail({ url: this.state.file_path, timestamp: 100 }).then(thumbnail => {
            this.setSafeState({isLoading: false, thumbnail: thumbnail.path});
            console.log('thumbnail', thumbnail);
        });
    }

    onUpdatePhoto = () => {
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
                        this.choosePhoto();
                    }
                },
            ]);
    }

    onUpdateVideo = () => {
        Alert.alert(
            '',
            I18n.t('Upload_video'),
            [
                {
                    text: I18n.t("Cancel"), onPress: () => {
                    }
                },
                {
                    text: I18n.t('Take_a_video'), onPress: () => {
                        this.takeVideo();
                    }
                },
                {
                    text: I18n.t('Choose_a_video'), onPress: () => {
                        this.chooseVideo();
                    }
                },
            ]);
    }

    isValid = () => {
        const {text} = this.state;
        if(!text.length){
            showToast(I18n.t('please_enter_post_text'));
            this.textInput.focus();
            return false;
        }
        return true;
    }


    onSubmit = () => {
        if(this.isValid()){
            const {file_path, thumbnail, type, text, postId} = this.state;
            const {user} = this.props;
            this.setState({isLoading: true});

            let post = {
                id: postId,
                userId: user.userId,
                type: type,
                text: text,
                date: new Date()
            }

            if(!file_path){
                return this.savePost(post);
            }

            switch (type){
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
        firebaseSdk.setData(firebaseSdk.TBL_POST, DB_ACTION_UPDATE, post)
            .then(() => {
                showToast(I18n.t('Update_post_complete'));
                this.setState({isLoading: false});
                navigation.pop();
            })
            .catch(() => {
                showErrorAlert(I18n.t('Update_post_failed'));
                this.setState({isLoading: false});
            })
    }

    renderForm = () => {
        const {type, text, file_path, photo, video, thumbnail, playing} = this.state;
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
                        <TouchableOpacity onPress={this.onUpdatePhoto} style={[styles.editIcon, { position: 'absolute' }]} theme={theme}>
                            <VectorIcon size={24} name={"edit"} type={"FontAwesome"} color={'grey'}/>
                        </TouchableOpacity>
                        <Image source={{uri: file_path?file_path:photo}} style={styles.imageStyle}/>
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
                    </View>
                )
            case POST_TYPE_VIDEO:
                return (
                    <View style={styles.inputContainer}>
                        {   playing &&
                            <Video
                                source={{uri: file_path?file_path:video}}
                                style={styles.video}
                                controls
                                onEnd={() => this.setState({playing: false})}
                                resizeMode={'contain'}/>
                        }
                        {
                            thumbnail && !playing &&
                            <View style={styles.thumbnailContainer}>
                                <TouchableOpacity onPress={this.onUpdateVideo} style={[styles.editIcon, { position: 'absolute' }]}>
                                    <VectorIcon size={24} name={"edit"} type={"FontAwesome"} color={'grey'}/>
                                </TouchableOpacity>
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
        const {navigation, theme} = this.props;
        const {text, isLoading} = this.state;
        return (
            <PageContainer
                navigation={navigation}
                title={I18n.t('Edit_post')}
                headerRight={() => <HeaderButton.Save navigation={navigation} onPress={this.onSubmit} testID='rooms-list-view-create-channel'/>}
            >
                <KeyboardView
                    contentContainerStyle={sharedStyles.container}
                    keyboardVerticalOffset={128}
                >
                    <StatusBar/>
                    <LinearGradient colors={[HEADER_BAR_START, HEADER_BAR_END]} style={sharedStyles.topLinearGradient} angle={90} useAngle/>
                    <ScrollView contentContainerStyle={{flexGrow: 1, paddingTop: 52 + getStatusBarHeight(true)}} {...scrollPersistTaps}>
                        <SafeAreaView>
                            {
                                isLoading && <ActivityIndicator absolute theme={theme} size={'large'}/>
                            }
                            { this.renderForm() }
                        </SafeAreaView>
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

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(EditPostView));
