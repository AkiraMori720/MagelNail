import React from 'react';
import PropTypes from "prop-types";
import StatusBar from "../../containers/StatusBar";
import SafeAreaView from "../../containers/SafeAreaView";
import {withTheme} from "../../theme";
import {ImageBackground, Modal, Text, View} from 'react-native';
import styles from "./styles";
import {setUser as setUserAction} from "../../actions/login";
import images from "../../assets/images";
import {connect} from "react-redux";
import sharedStyles from '../Styles';
import {createPaymentMethod, CardField} from '@stripe/stripe-react-native';
import Button from '../../containers/Button';
import firebaseSdk from '../../lib/firebaseSdk';
import {showErrorAlert, showToast} from '../../lib/info';
import {GradientHeader} from '../../containers/GradientHeader';
import I18n from '../../i18n';
import LinearGradient from 'react-native-linear-gradient';
import {COLOR_PRIMARY, HEADER_BAR_END, HEADER_BAR_START, themes} from '../../constants/colors';
import TextInput from '../../containers/TextInput';

class CreditCardView extends React.Component {
    static navigationOptions = ({navigation}) => ({
        title: I18n.t('Credit_card'),
        headerBackground: () => <GradientHeader/>
    })

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
            showConfirmDlg: false,
            isConfirming: false,
            password: '',
            isUpdating: false,
            isLoading: false,
            payment_method_id: props.user.payment_method_id,
            stripe_customer_id: props.user.stripe_customer_id,
            cardDetails: props.user.cardDetails??{}
        }
    }

    componentDidMount() {
        this.mounted = true;
    }

    onSubmit = () => {
        const {user, setUser} = this.props;
        if (this.state.cardDetails.complete) {
            this.setState({isLoading: true});
            createPaymentMethod({
                type: 'Card',
                billingDetails: {
                    email: user.email,
                    name: user.displayName
                }
            }).then(({paymentMethod}) => {
                const updates = {
                    id: user.id,
                    cardDetails: this.state.cardDetails,
                    payment_method_id: paymentMethod.id
                }
                firebaseSdk.updateUserPayment(user.id, updates).then((customer) => {
                    showToast(I18n.t('Card_register_complete'));
                    setUser({...updates, stripe_customer_id: customer.id});
                    this.setState({payment_method_id: paymentMethod.id, stripe_customer_id: customer.id, isUpdating: false, isLoading: false})
                }).catch(err => {
                    showToast(I18n.t('Card_register_failed'));
                    this.setState({isLoading: false});
                })
            }).catch(() => {
                showToast(I18n.t('Card_register_failed'));
                this.setState({isLoading: false});
            })
        }
    }

    onUpdate = () => {
        this.setState({showConfirmDlg: true});
    }

    onCancelModal = () => {
        this.setState({showConfirmDlg: false});
    }

    onConfirmModal = () => {
        const { user } = this.props;
        const { password } = this.state;
        if(!password.length){
            showToast(I18n.t('please_enter_password'));
            this.passwordInput.focus();
            return false;
        }
        this.setState({isConfirming: true});
        firebaseSdk.reauthenticate(user.email, password).then(() => {
            this.setState({isConfirming: false, showConfirmDlg: false, isUpdating: true});
        }).catch((err) => {
            this.setState({isConfirming: false});
            showErrorAlert(I18n.t('error-invalid-password'));
        })
    }

    render() {
        const {user, theme} = this.props;
        const {isLoading, isUpdating, payment_method_id, stripe_customer_id, showConfirmDlg, isConfirming} = this.state;

        if(payment_method_id && !isUpdating && stripe_customer_id){
           return (<ImageBackground style={sharedStyles.container} source={images.bg_splash_onboard}>
                <SafeAreaView>
                    <StatusBar/>
                    <LinearGradient colors={[HEADER_BAR_START, HEADER_BAR_END]} style={sharedStyles.topLinearGradient} angle={90} useAngle/>
                    <View style={styles.headerContainer}>
                        <Text style={styles.headerText}>{I18n.t('Your_card_info')}</Text>
                    </View>
                    <View style={styles.formContainer}>
                        <Text style={styles.cardBrand}>{user.cardDetails.brand}</Text>
                        <Text style={styles.cardNumber}>**** **** **** {user.cardDetails.last4}</Text>
                        <Text style={styles.cardExpiry}>{user.cardDetails.expiryMonth}/{user.cardDetails.expiryYear}</Text>
                        <Button
                            style={styles.submitBtn}
                            title={I18n.t('Change')}
                            type="primary"
                            size="W"
                            onPress={this.onUpdate}
                            testID="security-view-submit"
                            loading={isLoading}
                            theme={theme}
                        />
                    </View>
                    <Modal
                        transparent
                        visible={showConfirmDlg}
                    >
                        <View style={[styles.modalContainer, {backgroundColor: '#80808080'}]}>
                            <View style={[styles.modalContent, {backgroundColor: themes[theme].backgroundColor}]}>
                                <Text style={styles.modalTitle}>{I18n.t('please_enter_password')}</Text>
                                <TextInput
                                    inputRef={(e) => {
                                        this.passwordInput = e;
                                    }}
                                    iconLeft={images.password}
                                    placeholder={I18n.t('Password')}
                                    returnKeyType="send"
                                    secureTextEntry
                                    textContentType="oneTimeCode"
                                    onChangeText={password => this.setState({password})}
                                    onSubmitEditing={() => {
                                        this.onConfirmModal();
                                    }}
                                    theme={theme}
                                />
                                <View style={styles.buttonContainer}>
                                    <Button
                                        title={I18n.t('Cancel')}
                                        type={'secondary'}
                                        size={'U'}
                                        backgroundColor={themes[theme].chatComponentBackground}
                                        style={styles.button}
                                        onPress={this.onCancelModal}
                                        theme={theme}
                                        />
                                    <Button
                                        title={I18n.t('Confirm')}
                                        type={'primary'}
                                        size={'U'}
                                        style={styles.button}
                                        onPress={this.onConfirmModal}
                                        loading={isConfirming}
                                        theme={theme}
                                    />
                                </View>
                            </View>
                        </View>
                    </Modal>
                </SafeAreaView>
           </ImageBackground>);
        }

        return (
            <ImageBackground style={sharedStyles.container} source={images.bg_splash_onboard}>
                <SafeAreaView>
                    <StatusBar/>
                    <LinearGradient colors={[HEADER_BAR_START, HEADER_BAR_END]} style={sharedStyles.topLinearGradient} angle={90} useAngle/>
                    <View style={styles.headerContainer}>
                        <Text style={styles.headerText}>{I18n.t('please_enter_card_info')}</Text>
                    </View>
                    <View style={styles.formContainer}>
                        <CardField
                            postalCodeEnabled={false}
                            placeholder={{
                                number: '4242 4242 4242 4242',
                            }}
                            cardStyle={{
                                backgroundColor: '#FFFFFF',
                                textColor: '#000000',
                            }}
                            style={{
                                width: '100%',
                                height: 50,
                                marginVertical: 30,
                            }}
                            onCardChange={(cardDetails) => {
                                this.setState({cardDetails});
                            }}
                        />
                        <Button
                            style={styles.submitBtn}
                            title={I18n.t('Save')}
                            type="primary"
                            size="W"
                            onPress={this.onSubmit}
                            testID="security-view-submit"
                            loading={isLoading}
                            theme={theme}
                        />
                    </View>
                </SafeAreaView>
            </ImageBackground>
        )
    }
}

const mapStateToProps = state => ({
    user: state.login.user
})

const mapDispatchToProps = dispatch => ({
    setUser: params => dispatch(setUserAction(params))
})

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(CreditCardView));
