import React from 'react';
import {
    View,
    StyleSheet,
    PermissionsAndroid, Platform, Image, Text, ImageBackground, SafeAreaView,
} from 'react-native';
import {connect} from 'react-redux';
import {appInit as appInitAction} from '../actions/app';
import images from "../assets/images";
import StatusBar from "../containers/StatusBar";
import {withTheme} from "../theme";
import PropTypes from "prop-types";
import {PERMISSIONS, requestMultiple} from "react-native-permissions";
import sharedStyles from './Styles';
import {COLOR_WHITE, HEADER_BAR_START, NAV_BAR_END, NAV_BAR_START, themes} from "../constants/colors";
import LinearGradient from "react-native-linear-gradient";

const styles = StyleSheet.create({
    mainContainer: {
        marginTop: 90,
        flexGrow: 1,
        position: 'relative'
    },
    logoContainer: {
        borderTopLeftRadius: 250,
        borderTopRightRadius: 250,
        flexGrow: 1,
    },
    logoInnerContainer: {
        marginTop: 12,
        borderTopLeftRadius: 250,
        borderTopRightRadius: 250,
        flexGrow: 1,
    },
    logo: {
        marginTop: 60,
        height: 240,
        alignSelf: 'center',
        resizeMode: 'contain',
    },
    bottomBack: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    border: {
        resizeMode: 'cover',
        width: '100%',
        height: 180,
    },
});


class SplashView extends React.Component {
    static propTypes = {
        navigation: PropTypes.object,
        appInit: PropTypes.func,
        theme: PropTypes.string
    }

    constructor(props) {
        super(props);
        this.state = {
            notShowAgain: false,
            currentIndex: 0
        }
        this.requestPermission();
    }

    componentDidMount() {
        setTimeout(() => {
            this.props.appInit();
        }, 1500);
    }

    requestPermission = () => {
        if (Platform.OS === 'android') {
            this.requestPermissionAndroid()
                .then(() => {
                })
                .catch((err) => {
                    console.log('request permission error', err);
                })
        } else {
            this.requestPermissionIOS()
                .then(() => {
                })
                .catch((err) => {
                    console.log('request permission error', err);
                })
        }
    }

    requestPermissionAndroid = async () => {
        try {
            const results = await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.CAMERA,
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
            ]);
            if (results[PermissionsAndroid.PERMISSIONS.CAMERA] === PermissionsAndroid.RESULTS.GRANTED &&
                results[PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE] === PermissionsAndroid.RESULTS.GRANTED &&
                results[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] === PermissionsAndroid.RESULTS.GRANTED) {
                // console.log('all permission granted');

            } else {
                console.log('permission denied');
            }
        } catch (err) {
            console.log(err);
        }
    };

    requestPermissionIOS = () => {
        return new Promise((resolve, reject) => {
            console.log('request permission');
            requestMultiple([PERMISSIONS.IOS.CAMERA, PERMISSIONS.IOS.PHOTO_LIBRARY]).then(
                (statuses) => {
                    console.log('request permission', statuses);
                    resolve();
                }
            ).catch((err) => {
                console.log('request permission', err);
                reject(err)
            })
        })
    }

    render() {
        const {theme} = this.props;
        return (
            <SafeAreaView style={[sharedStyles.container, {backgroundColor: themes[theme].backgroundColor}]}>
                <StatusBar backgroundColor={'white'}/>
                <View style={[styles.mainContainer, {backgroundColor: themes[theme].backgroundColor}]}>
                    <LinearGradient style={styles.logoContainer} colors={[HEADER_BAR_START, COLOR_WHITE]} angle={90} useAngle>
                        <LinearGradient style={styles.logoInnerContainer} colors={[NAV_BAR_END, NAV_BAR_START]}>
                            <Image source={images.logo} style={styles.logo}/>
                        </LinearGradient>
                    </LinearGradient>
                    <View style={styles.bottomBack}>
                        <Image source={images.background_border} style={styles.border}/>
                    </View>
                </View>
            </SafeAreaView>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    appInit: params => dispatch(appInitAction(params)),
});

export default connect(null, mapDispatchToProps)(withTheme(SplashView));
