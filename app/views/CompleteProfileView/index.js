import React from 'react';
import PropTypes from 'prop-types';

import {withTheme} from '../../theme';
import TextInput from '../../containers/TextInput';
import sharedStyles from '../Styles';
import StatusBar from '../../containers/StatusBar';
import styles from './styles';
import {Image, SafeAreaView, ScrollView, View} from 'react-native';
import Button from '../../containers/Button';
import images from '../../assets/images';
import {showErrorAlert, showToast} from '../../lib/info';
import firebaseSdk, {DB_ACTION_UPDATE} from '../../lib/firebaseSdk';
import LinearGradient from 'react-native-linear-gradient';
import {
    COLOR_WHITE,
    HEADER_BAR_START, NAV_BAR_END,
    NAV_BAR_START,
    themes
} from '../../constants/colors';
import I18n from '../../i18n';
import KeyboardView from '../../containers/KeyboardView';
import {appStart as appStartAction, ROOT_INSIDE} from '../../actions/app';
import {connect} from 'react-redux';
import scrollPersistTaps from "../../utils/scrollPersistTaps";
import {NAIL_TYPE_LOVER} from "../../constants/app";
import CsSelectType from "../../containers/CsSelectType";
import {setUser as setUserAction} from "../../actions/login";

class CompleteProfileView extends React.Component {

    static propTypes = {
        user: PropTypes.object,
        navigation: PropTypes.object,
        theme: PropTypes.string,
    };

    constructor(props) {
        super(props);
        const user = props.user;
        console.log('user', props.user);
        this.state = {
            name: user.displayName,
            salon_name: user.salon_name,
            address: user.address,
            phone: user.phone,
            salon_instagram_account: '',
            type: NAIL_TYPE_LOVER,
            isLoading: false
        };
    }

    isValid = () => {
        const {name, salon_name} = this.state;

        if (!name.length) {
            showToast(I18n.t('please_enter_name'));
            this.nameInput.focus();
            return false;
        }
        if (!salon_name) {
            showToast(I18n.t('please_enter_salon_name'));
            this.salonNameInput.focus();
            return false;
        }
        return true;
    };

    onSubmit = () => {
        if (this.isValid()) {

            this.setState({isLoading: true});
            const {appStart, user, setUser} = this.props;
            const {name, salon_name, address, phone, salon_instagram_account, type} = this.state;

            const userInfo = {
                id: user.id,
                displayName: name,
                salon_name: salon_name,
                address,
                phone,
                salon_instagram_account,
                type
            };

            firebaseSdk.setData(firebaseSdk.TBL_USER, DB_ACTION_UPDATE, userInfo)
                .then(() => {
                    this.setState({isLoading: false});
                    const updateUser = {...user, ...userInfo};
                    console.log('update user', updateUser);
                    setUser(updateUser);
                    appStart({root: ROOT_INSIDE});
                })
                .catch((err) => {
                    showErrorAlert(err, I18n.t('Oops'));
                    this.setState({isLoading: false});
                });
        }
    };

    render() {
        const {theme} = this.props;
        const {isLoading, type, name, salon_name, address, phone, salon_instagram_account} = this.state;
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
                                    value={name}
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
                                    value={salon_name}
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
                                    value={address}
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
                                    value={phone}
                                    onChangeText={phone => this.setState({phone})}
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
                                    value={salon_instagram_account}
                                    onChangeText={value => this.setState({salon_instagram_account: value})}
                                    theme={theme}
                                />
                                <CsSelectType
                                    label={I18n.t('Your_type')}
                                    value={type}
                                    onChange={value => this.setState({type: value})}
                                    theme={theme}
                                />
                                <Button
                                    style={styles.submitBtn}
                                    title={I18n.t('Save')}
                                    type="gradient"
                                    size="W"
                                    onPress={this.onSubmit}
                                    testID="login-view-submit"
                                    loading={isLoading}
                                    theme={theme}
                                />
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

const mapStateToProps = state => ({
    user: state.login.user
})

const mapDispatchToProps = dispatch => ({
    appStart: params => dispatch(appStartAction(params)),
    setUser: params => dispatch(setUserAction(params))
});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(CompleteProfileView));
