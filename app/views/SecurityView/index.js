import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Image, ImageBackground, ScrollView, Text, View} from 'react-native';

import {withTheme} from '../../theme';
import KeyboardView from '../../containers/KeyboardView';
import StatusBar from '../../containers/StatusBar';
import sharedStyles from '../Styles';
import styles from './styles';
import images from '../../assets/images';
import Button from '../../containers/Button';
import TextInput from '../../containers/TextInput';
import scrollPersistTaps from '../../utils/scrollPersistTaps';
import SafeAreaView from '../../containers/SafeAreaView';
import {showErrorAlert, showToast} from '../../lib/info';
import {isValidEmail} from '../../utils/validators';
import firebaseSdk from '../../lib/firebaseSdk';
import AsyncStorage from '@react-native-community/async-storage';
import {CURRENT_USER} from '../../constants/keys';
import {setUser as setUserAction} from '../../actions/login';
import I18n from '../../i18n';
import {GradientHeader} from '../../containers/GradientHeader';
import LinearGradient from 'react-native-linear-gradient';
import {HEADER_BAR_END, HEADER_BAR_START} from '../../constants/colors';
import PageContainer from "../../containers/PageContainer";
import {getStatusBarHeight} from "../../utils/statusbar";

class SecurityView extends React.Component {

    static propTypes = {
        navigation: PropTypes.object,
        SetUser: PropTypes.func,
        theme: PropTypes.string,
    };

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            email: '',
            old_password: '',
            password: '',
        };
    }

    isValid = () => {
        const {email, password, old_password} = this.state;
        if (!email.length) {
            showToast(I18n.t('please_enter_email'));
            this.emailInput.focus();
            return false;
        }
        if (!isValidEmail(email)) {
            showToast(I18n.t('error-invalid-email-address'));
            this.emailInput.focus();
            return false;
        }
        if (!old_password.length) {
            showToast(I18n.t('please_enter_old_password'));
            this.oldPasswordInput.focus();
            return false;
        }
        if (!password.length) {
            showToast(I18n.t('please_enter_password'));
            this.passwordInput.focus();
            return false;
        }
        return true;
    };

    onSubmit = () => {
        if (this.isValid()) {
            const {email, old_password, password} = this.state;
            const {user, setUser} = this.props;
            this.setState({isLoading: true});

            firebaseSdk.reauthenticate(email, old_password).then(() =>{
                firebaseSdk.updateCredential(email, password)
                    .then(async () => {
                        this.setState({isLoading: false});
                        const newUser = {...user, email: email};
                        await AsyncStorage.setItem(CURRENT_USER, JSON.stringify(newUser));
                        setUser(newUser);
                        showToast(I18n.t('Updating_security_complete'));
                    })
                    .catch(err => {
                        this.setState({isLoading: false});
                        showErrorAlert(I18n.t('Updating_security_failed'));
                        console.log('error', err);
                    });
            }).catch(err => {
                this.setState({isLoading: false});
                showErrorAlert(I18n.t('error-invalid-email_or_password'));
            });

        }
    };


    render() {
        const {navigation, theme} = this.props;
        const {isLoading} = this.state;
        return (
            <PageContainer
                navigation={navigation}
                title={I18n.t('Security_setting')}
            >
                <KeyboardView
                    keyboardVerticalOffset={128}
                >
                    <StatusBar/>
                    <ScrollView style={{flexGrow: 1, paddingTop: 52 + getStatusBarHeight(true)}} {...scrollPersistTaps}>
                        <SafeAreaView>
                            <View style={styles.headerContainer}>
                                <Text style={styles.headerText}>{I18n.t('Update_security_caption')}</Text>
                            </View>
                            <View style={styles.formContainer}>
                                <TextInput
                                    inputRef={(e) => {
                                        this.emailInput = e;
                                    }}
                                    iconLeft={images.mail}
                                    placeholder={I18n.t('Email')}
                                    returnKeyType="next"
                                    keyboardType="email-address"
                                    textContentType="oneTimeCode"
                                    onChangeText={email => this.setState({email})}
                                    onSubmitEditing={() => {
                                        this.oldPasswordInput.focus();
                                    }}
                                    theme={theme}
                                />
                                <TextInput
                                    inputRef={(e) => {
                                        this.oldPasswordInput = e;
                                    }}
                                    iconLeft={images.password}
                                    placeholder={I18n.t('Old_password')}
                                    returnKeyType="send"
                                    secureTextEntry
                                    textContentType="oneTimeCode"
                                    onChangeText={value => this.setState({old_password: value})}
                                    onSubmitEditing={() => {
                                        this.passwordInput.focus();
                                    }}
                                    theme={theme}
                                />
                                <TextInput
                                    inputRef={(e) => {
                                        this.passwordInput = e;
                                    }}
                                    iconLeft={images.password}
                                    placeholder={I18n.t('New_Password')}
                                    returnKeyType="send"
                                    secureTextEntry
                                    textContentType="oneTimeCode"
                                    onChangeText={value => this.setState({password: value})}
                                    theme={theme}
                                />
                                <Button
                                    style={styles.submitBtn}
                                    title={I18n.t('Change_password')}
                                    type="primary"
                                    size="W"
                                    onPress={this.onSubmit}
                                    testID="security-view-submit"
                                    loading={isLoading}
                                    theme={theme}
                                />
                            </View>
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

const mapDispatchToProps = dispatch => ({
    setUser: params => dispatch(setUserAction(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(SecurityView));
