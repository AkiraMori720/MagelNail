import React from 'react';
import PropTypes from 'prop-types';

import {withTheme} from '../../theme';
import TextInput from '../../containers/TextInput';
import sharedStyles from '../Styles';
import StatusBar from '../../containers/StatusBar';
import styles from './styles';
import {Image, Platform, SafeAreaView, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import Button from '../../containers/Button';
import images from '../../assets/images';
import {isValidEmail} from '../../utils/validators';
import {showErrorAlert, showToast} from '../../lib/info';
import firebaseSdk from '../../lib/firebaseSdk';
import LinearGradient from 'react-native-linear-gradient';
import {
    COLOR_WHITE,
    COLOR_YELLOW,
    HEADER_BAR_START, NAV_BAR_END,
    NAV_BAR_START,
    themes
} from '../../constants/colors';
import I18n from '../../i18n';
import KeyboardView from '../../containers/KeyboardView';
import AsyncStorage from '@react-native-community/async-storage';
import {CURRENT_USER} from '../../constants/keys';
import {loginSuccess as loginSuccessAction} from '../../actions/login';
import {connect} from 'react-redux';
import {VectorIcon} from '../../containers/VectorIcon';
import scrollPersistTaps from "../../utils/scrollPersistTaps";
import {NAIL_TYPE_LOVER} from "../../constants/app";
import CsSelectType from "../../containers/CsSelectType";

class SingUpView extends React.Component {

    static propTypes = {
        navigation: PropTypes.object,
        theme: PropTypes.string,
    };

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            salon_name: '',
            address: '',
            phone: '',
            email: '',
            password: '',
            confirm_password: '',
            salon_instagram_account: '',
            type: NAIL_TYPE_LOVER,
            allowTerms: false,
            isLoading: false
        };
    }

    onGoToSignIn = () => {
        const {navigation} = this.props;
        navigation.navigate('SignIn');
    };

    onGotoTerms = () => {
        const {navigation} = this.props;
        navigation.navigate('About', {type: 0});
    }

    onGotoPrivacy = () => {
        const {navigation} = this.props;
        navigation.navigate('About', {type: 1});
    }

    isValid = () => {
        const {name, salon_name, password, confirm_password, email} = this.state;

        if (!name.length) {
            showToast(I18n.t('please_enter_name'));
            this.nameInput.focus();
            return false;
        }
        if (!salon_name.length) {
            showToast(I18n.t('please_enter_salon_name'));
            this.salonNameInput.focus();
            return false;
        }
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
        if (!password.length) {
            showToast(I18n.t('please_enter_password'));
            this.passwordInput.focus();
            return false;
        }
        if (password.length < 6) {
            showToast(I18n.t('please_enter_password_with_min_length_6'));
            this.passwordInput.focus();
            return false;
        }
        if (password !== confirm_password){
            showToast(I18n.t('error-invalid-password-repeat'));
            this.confirmPasswordInput.focus();
            return false;
        }
        return true;
    };

    onSubmit = () => {
        if (this.isValid()) {

            this.setState({isLoading: true});
            const {loginSuccess, navigation} = this.props;
            const {name, salon_name, address, phone, email, password, salon_instagram_account, type} = this.state;

            const user = {
                displayName: name,
                salon_name: salon_name,
                address,
                phone,
                email: email,
                password: password,
                salon_instagram_account,
                type
            };

            firebaseSdk.signUp(user)
                .then(async () => {
                    showToast(I18n.t('Register_complete'));
                    firebaseSdk.signInWithEmail(email, password)
                        .then(async (user) => {
                            await AsyncStorage.setItem(CURRENT_USER, JSON.stringify(user));
                            this.setState({isLoading: false});
                            loginSuccess(user);
                        })
                        .catch((error) => {
                            navigation.navigate('SignIn');
                        })
                })
                .catch((err) => {
                    showErrorAlert(I18n.t('Register_fail'));
                    this.setState({isLoading: false});
                });
        }
    };


    onSignInWithOAuth = async (oauth) => {
        const {loginSuccess} = this.props;
        this.setState({isLoading: true});
        switch (oauth){
            case 'facebook':
                await firebaseSdk.facebookSignIn()
                    .then(async(credential) => {
                        console.log('facebook', credential);
                        const { user } = credential;
                        const names = user.displayName.split(' ');
                        const credentialInfo = {
                            uid: user.uid,
                            firstName: names[0],
                            lastName: names[1]??'',
                            email: user.email,
                            avatar: user.photoURL?user.photoURL + '?type=large':''
                        }
                        await firebaseSdk.socialLogin(credentialInfo).then(async (user) => {
                            await AsyncStorage.setItem(CURRENT_USER, JSON.stringify(user));
                            loginSuccess(user);
                            this.setState({isLoading: false});
                        }).catch(err => {
                            this.setState({isLoading: false});
                        })
                    }).catch(err => {
                        console.log('error', err);
                        this.setState({isLoading: false});
                    });
                break;
            case 'google':
                await firebaseSdk.googleSignIn()
                    .then(async(credential) => {
                        console.log('google', credential);
                        const { user } = credential;
                        const names = user.displayName.split(' ');
                        const credentialInfo = {
                            uid: user.uid,
                            firstName: names[0],
                            lastName: names[1]??'',
                            email: user.email,
                            avatar: user.photoURL??''
                        }
                        await firebaseSdk.socialLogin(credentialInfo).then(async (user) => {
                            await AsyncStorage.setItem(CURRENT_USER, JSON.stringify(user));
                            loginSuccess(user);
                            this.setState({isLoading: false});
                        }).catch(err => {
                            this.setState({isLoading: false});
                        })
                    }).catch(err => {
                        console.log('error', err);
                        this.setState({isLoading: false});
                    });
                break;
            case 'apple':
                await firebaseSdk.appleSignIn()
                    .then(async(credential) => {
                        console.log('apple', credential);
                        const { user } = credential;
                        const names = user.displayName?.split(' ')??[];
                        const credentialInfo = {
                            uid: user.uid,
                            firstName: names[0]??'',
                            lastName: names[1]??'',
                            email: user.email,
                            avatar: user.photoURL??''
                        }
                        await firebaseSdk.socialLogin(credentialInfo).then((user) => {
                            loginSuccess(user);
                            this.setState({isLoading: false});
                        }).catch(err => {
                            this.setState({isLoading: false});
                        })
                    }).catch(err => {
                        this.setState({isLoading: false});
                    });
                break;
        }
    }


    render() {
        const {theme} = this.props;
        const {isLoading, type, allowTerms} = this.state;
        return (
        <SafeAreaView style={{ flex: 1, backgroundColor: themes[theme].backgroundColor}}>
            <KeyboardView
                contentContainerStyle={sharedStyles.container}
                keyboardVerticalOffset={128}
            >
                <StatusBar backgroundColor={'white'}/>
                <ScrollView style={{flex: 1}} {...scrollPersistTaps}>
                    <LinearGradient style={styles.logoContainer} colors={[HEADER_BAR_START, COLOR_WHITE]} angle={90} useAngle>
                        <LinearGradient style={styles.logoInnerContainer} colors={[NAV_BAR_END, NAV_BAR_START]}>
                            <Image source={images.logo} style={styles.logo}/>
                            <View style={styles.formContainer}>
                                <TextInput
                                    inputRef={(e) => {
                                        this.nameInput = e;
                                    }}
                                    label={I18n.t('Name')}
                                    returnKeyType="next"
                                    keyboardType="default"
                                    textContentType="oneTimeCode"
                                    inputStyle={styles.inputStyle}
                                    onChangeText={value => this.setState({name: value})}
                                    onSubmitEditing={() => {
                                        this.salonNameInput.focus();
                                    }}
                                    theme={theme}
                                />
                                <TextInput
                                    inputRef={(e) => {
                                        this.salonNameInput = e;
                                    }}
                                    label={I18n.t('Salon_name')}
                                    returnKeyType="next"
                                    keyboardType="default"
                                    textContentType="oneTimeCode"
                                    inputStyle={styles.inputStyle}
                                    onChangeText={value => this.setState({salon_name: value})}
                                    onSubmitEditing={() => {
                                        this.addressInput.focus();
                                    }}
                                    theme={theme}
                                />
                                <TextInput
                                    inputRef={(e) => {
                                        this.addressInput = e;
                                    }}
                                    label={I18n.t('Address')}
                                    returnKeyType="next"
                                    keyboardType="default"
                                    textContentType="oneTimeCode"
                                    inputStyle={styles.inputStyle}
                                    onChangeText={value => this.setState({address: value})}
                                    onSubmitEditing={() => {
                                        this.phoneInput.focus();
                                    }}
                                    theme={theme}
                                />
                                <TextInput
                                    inputRef={(e) => {
                                        this.phoneInput = e;
                                    }}
                                    label={I18n.t('Phone')}
                                    returnKeyType="next"
                                    keyboardType="phone-pad"
                                    textContentType="oneTimeCode"
                                    inputStyle={styles.inputStyle}
                                    onChangeText={phone => this.setState({phone})}
                                    onSubmitEditing={() => {
                                        this.emailInput.focus();
                                    }}
                                    theme={theme}
                                />
                                <TextInput
                                    inputRef={(e) => {
                                        this.emailInput = e;
                                    }}
                                    label={I18n.t('Email')}
                                    returnKeyType="next"
                                    keyboardType="email-address"
                                    textContentType="oneTimeCode"
                                    inputStyle={styles.inputStyle}
                                    onChangeText={email => this.setState({email})}
                                    onSubmitEditing={() => {
                                        this.passwordInput.focus();
                                    }}
                                    theme={theme}
                                />
                                <TextInput
                                    inputRef={(e) => {
                                        this.passwordInput = e;
                                    }}
                                    label={I18n.t('Password')}
                                    returnKeyType="next"
                                    secureTextEntry
                                    textContentType="oneTimeCode"
                                    inputStyle={styles.inputStyle}
                                    onChangeText={value => this.setState({password: value})}
                                    onSubmitEditing={() => {
                                        this.confirmPasswordInput.focus();
                                    }}
                                    theme={theme}
                                />
                                <TextInput
                                    inputRef={(e) => {
                                        this.confirmPasswordInput = e;
                                    }}
                                    label={I18n.t('Confirm_password')}
                                    returnKeyType="next"
                                    secureTextEntry
                                    textContentType="oneTimeCode"
                                    inputStyle={styles.inputStyle}
                                    onChangeText={value => this.setState({confirm_password: value})}
                                    onSubmitEditing={() => {
                                        this.salonInstagramAccountInput.focus();
                                    }}
                                    theme={theme}
                                />
                                <TextInput
                                    inputRef={(e) => {
                                        this.salonInstagramAccountInput = e;
                                    }}
                                    label={I18n.t('Salon_instagram_account')}
                                    returnKeyType="next"
                                    keyboardType="default"
                                    textContentType="oneTimeCode"
                                    inputStyle={styles.inputStyle}
                                    onChangeText={value => this.setState({salon_instagram_account: value})}
                                    theme={theme}
                                />
                                <CsSelectType
                                    label={I18n.t('Your_type')}
                                    value={type}
                                    onChange={value => this.setState({type: value})}
                                    theme={theme}
                                />
                                {
                                    I18n.locale === 'en'?
                                    <View style={styles.terms}>
                                        <View style={styles.termItem}>
                                            <TouchableOpacity style={{marginHorizontal: 8}} onPress={() => this.setState({allowTerms: !allowTerms})}>
                                                <VectorIcon name={allowTerms ? 'check-square-o' : 'square-o'} type={'FontAwesome'} size={24} color={allowTerms?COLOR_YELLOW:'black'} />
                                            </TouchableOpacity>
                                            <Text style={{color: themes[theme].buttonText}}>I agree with the </Text>
                                            <Text style={{...sharedStyles.link, color: themes[theme].buttonText}}
                                                  onPress={this.onGotoTerms}> Terms and Conditions </Text>
                                            <Text style={{color: themes[theme].buttonText}}> and </Text>
                                        </View>
                                        <View style={{marginLeft: 30}}>
                                            <Text style={{...sharedStyles.link, color: themes[theme].buttonText}}
                                                  onPress={this.onGotoPrivacy}> Privacy Policy </Text>
                                        </View>
                                    </View> :
                                    <View style={styles.terms}>
                                        <View style={styles.termItem}>
                                            <TouchableOpacity style={{marginHorizontal: 8}} onPress={() => this.setState({allowTerms: !allowTerms})}>
                                                <VectorIcon name={allowTerms ? 'check-square-o' : 'square-o'} type={'FontAwesome'} size={24} color={allowTerms?COLOR_YELLOW:'black'} />
                                            </TouchableOpacity>
                                            <Text style={{...sharedStyles.link, color: themes[theme].buttonText}}
                                                  onPress={this.onGotoTerms}> 利用規約 </Text>
                                            <Text style={{color: themes[theme].buttonText}}> と </Text>
                                            <Text style={{...sharedStyles.link, color: themes[theme].buttonText}}
                                                  onPress={this.onGotoPrivacy}> プライバシーポリシー</Text>
                                            <Text style={{color: themes[theme].buttonText}}>に同意する </Text>
                                        </View>
                                    </View>
                                }
                                <Button
                                    style={styles.submitBtn}
                                    title={I18n.t('Register')}
                                    type="gradient"
                                    size="W"
                                    onPress={this.onSubmit}
                                    testID="login-view-submit"
                                    loading={isLoading}
                                    disabled={!allowTerms}
                                    theme={theme}
                                />
                                <View style={styles.oauthContainer}>
                                    <Button
                                        title={'facebook'}
                                        type='oauth'
                                        onPress={() => this.onSignInWithOAuth('facebook')}
                                        testID='login-view-submit'
                                        theme={theme}
                                    />
                                    <Button
                                        title={'google'}
                                        type='oauth'
                                        onPress={() => this.onSignInWithOAuth('google')}
                                        theme={theme}
                                    />
                                    {Platform.OS === 'ios' && <Button
                                        title={'apple'}
                                        type='oauth'
                                        onPress={() => this.onSignInWithOAuth('apple')}
                                        theme={theme}
                                    />}
                                </View>
                                <View style={styles.bottomContainer}>
                                    <Text style={{textTransform: 'uppercase'}}>{I18n.t('Have_an_account')}</Text>
                                    <Text style={[{...sharedStyles.link}, {textDecorationLine: 'none', textTransform: 'uppercase'}]}
                                          onPress={this.onGoToSignIn}> {I18n.t('SignIn')}</Text>
                                </View>
                            </View>
                        </LinearGradient>
                    </LinearGradient>
                    <View style={styles.bottom}>
                        <LinearGradient style={styles.bottomBarContainer} colors={[ COLOR_WHITE, HEADER_BAR_START]} angle={90} useAngle>
                            <LinearGradient style={styles.bottomBarInnerContainer} colors={[NAV_BAR_END, NAV_BAR_START]} angle={90} useAngle>
                            </LinearGradient>
                        </LinearGradient>
                    </View>
                </ScrollView>
            </KeyboardView>
        </SafeAreaView>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    loginSuccess: params => dispatch(loginSuccessAction(params)),
});

export default connect(null, mapDispatchToProps)(withTheme(SingUpView));
