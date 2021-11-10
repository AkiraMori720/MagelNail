import React from 'react';
import {
    SafeAreaView,
    View,
    StyleSheet,
    Image, Text,
} from 'react-native';
import {connect} from 'react-redux';
import {appStart as appStartAction} from '../actions/app';
import images from "../assets/images";
import StatusBar from "../containers/StatusBar";
import Button from "../containers/Button";
import {withTheme} from "../theme";
import PropTypes from "prop-types";
import I18n from "../i18n";
import {COLOR_WHITE, HEADER_BAR_END, HEADER_BAR_START, NAV_BAR_END, NAV_BAR_START, themes} from '../constants/colors';
import LinearGradient from "react-native-linear-gradient";
import sharedStyles from './Styles';

const styles = StyleSheet.create({
    mainContainer: {
        marginTop: 40,
        flexGrow: 1,
        position: 'relative'
    },
    logoContainer: {
        borderTopLeftRadius: 250,
        borderTopRightRadius: 250,
    },
    logoInnerContainer: {
        marginTop: 12,
        borderTopLeftRadius: 250,
        borderTopRightRadius: 250,
        padding: 24,
    },
    logo: {
        marginTop: 40,
        height: 180,
        alignSelf: 'center',
        resizeMode: 'contain',
    },
    welcome: {
        width: '70%',
        marginTop: 30,
        alignSelf: 'center',
    },
    welcomeText: {
        fontSize: 16,
        textTransform: 'uppercase',
        alignSelf: 'center',
        textAlign: 'center'
    },
    submitBtn: {
        paddingHorizontal: 32,
        marginTop: 20
    },
    bottomBack: {
        position: 'absolute',
        bottom: -100,
        left: 0,
        right: 0,
    },
    border: {
        resizeMode: 'contain',
        width: '100%',
        height: 200,
    },
});


class OnBoardingView extends React.Component {
    static propTypes = {
        navigation: PropTypes.object,
        appStart: PropTypes.func,
        theme: PropTypes.string
    }

    constructor(props) {
        super(props);
        this.state = {
            notShowAgain: false,
            currentIndex: 0
        }
    }

    render() {
        const {navigation, theme} = this.props;
        return (
            <SafeAreaView style={[sharedStyles.container, {backgroundColor: themes[theme].backgroundColor}]}>
                <StatusBar backgroundColor={'white'}/>
                <View style={[styles.mainContainer, {backgroundColor: themes[theme].backgroundColor}]}>
                    <LinearGradient style={styles.logoContainer} colors={[HEADER_BAR_START, COLOR_WHITE]} angle={90} useAngle>
                        <LinearGradient style={styles.logoInnerContainer} colors={[NAV_BAR_END, NAV_BAR_START]}>
                            <Image source={images.logo} style={styles.logo}/>
                        </LinearGradient>
                    </LinearGradient>
                    <View style={styles.welcome}>
                        <Text style={[styles.welcomeText, {color: themes[theme].infoText}]}>{I18n.t('Onboard_text_welcome')}</Text>
                        <Text style={[styles.welcomeText, {color: themes[theme].infoText}]}>{I18n.t('Onboard_text')}</Text>
                    </View>
                    <Button
                        style={styles.submitBtn}
                        title={I18n.t('Login')}
                        type='primary'
                        size='W'
                        onPress={() => navigation.replace('SignIn')}
                        testID='login-view-submit'
                        theme={theme}
                    />
                    <Button
                        style={styles.submitBtn}
                        title={I18n.t('Register')}
                        type='gradient'
                        size='W'
                        onPress={() => navigation.replace('SignUp')}
                        testID='login-view-submit'
                        theme={theme}
                    />
                    <View style={styles.bottomBack}>
                        <Image source={images.background_border} style={styles.border}/>
                    </View>
                </View>
            </SafeAreaView>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    appStart: params => dispatch(appStartAction(params)),
});

export default connect(null, mapDispatchToProps)(withTheme(OnBoardingView));
