import React from 'react';
import PropTypes from "prop-types";
import StatusBar from "../../containers/StatusBar";
import {Image, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import styles from "./styles";
import {clearCart as clearCartAction, updateOrder as updateOrderAction} from '../../actions/cart';
import * as HeaderButton from '../../containers/HeaderButton';
import {GradientHeader} from '../../containers/GradientHeader';
import {COLOR_BLUE, COLOR_YELLOW, HEADER_BAR_END, HEADER_BAR_START} from '../../constants/colors';
import scrollPersistTaps from '../../utils/scrollPersistTaps';
import CustomTextInput from './customInput';
import images from '../../assets/images';
import SafeAreaView from '../../containers/SafeAreaView';
import KeyboardView from '../../containers/KeyboardView';
import sharedStyles from '../Styles';
import LinearGradient from 'react-native-linear-gradient';
import {connect} from 'react-redux';
import {withTheme} from '../../theme';
import I18n from '../../i18n';
import {showErrorAlert, showToast} from '../../lib/info';
import firebaseSdk, {DB_ACTION_UPDATE, ORDER_STATUS_PAID} from '../../lib/firebaseSdk';
import {
    ApplePayButton,
    confirmApplePayPayment,
    isApplePaySupported,
    presentApplePay,
} from '@stripe/stripe-react-native';
import ActivityIndicator from '../../containers/ActivityIndicator';


class ShippingView extends React.Component {
    static navigationOptions = ({navigation}) => ({
        headerLeft: () => <HeaderButton.Drawer navigation={navigation} testID='nav-drawer' />,
        title: I18n.t('Shipping_information'),
        headerBackground: () => <GradientHeader/>
    })

    static propTypes = {
        updateOrder: PropTypes.func,
        order: PropTypes.object,
        cart: PropTypes.array,
        user: PropTypes.object,
        theme: PropTypes.string,
    }

    constructor(props) {
        super(props);
        this.mounted = false;
        this.state = {
            email: props.user.email,
            name: props.user.displayName,
            country: props.user.country,
            zip: '',
            prefectures: '',
            city: props.user.city,
            address: '',
            contact_no: '',
            shipping_charges: 0,
            loading: true,
            updating: false,
        }
        this.init();
    }

    componentDidMount() {
        this.mounted = true;
    }

    init = () => {
        firebaseSdk.getOptionData(firebaseSdk.OPTION_SHIPPING_CHARGES).then(config => {
            this.setState({loading: false, shipping_charges: (config && config.data)?config.data:0});
        }).catch(err => {
            this.setState({loading: false});
        })
    }

    isValid = () => {
        const {name, address, email} = this.state;

        if (!name.length) {
            showToast(I18n.t('please_enter_name'));
            this.nameInput.focus();
            return false;
        }
        if (!email.length) {
            showToast(I18n.t('please_enter_email'));
            this.emailInput.focus();
            return false;
        }
        if (!address.length) {
            showToast(I18n.t('please_enter_address'));
            this.addressInput.focus();
            return false;
        }
        return true;
    }

    onPayCredit = () => {
        if(this.isValid()){
            const {updateOrder, order} = this.props;
            const orderInfo = {
                id: order.id,
                shippingDetails: {
                    email: this.state.email,
                    name: this.state.name,
                    country: this.state.country,
                    zip: this.state.zip,
                    prefectures: this.state.prefectures,
                    city: this.state.city,
                    address: this.state.address,
                    contact_no: this.state.contact_no
                }
            }
            firebaseSdk.setData(firebaseSdk.TBL_ORDER, DB_ACTION_UPDATE, orderInfo).then(() => {
                updateOrder(orderInfo);
                this.props.navigation.replace('CreditPay');
            })
        }
    }

    onPayApple = async () => {
        if(this.isValid()) {
            const {updateOrder, order, cart} = this.props;
            const orderInfo = {
                id: order.id,
                shippingDetails: {
                    email: this.state.email,
                    name: this.state.name,
                    country: this.state.country,
                    zip: this.state.zip,
                    prefectures: this.state.prefectures,
                    city: this.state.city,
                    address: this.state.address,
                    contact_no: this.state.contact_no
                }
            }
            firebaseSdk.setData(firebaseSdk.TBL_ORDER, DB_ACTION_UPDATE, orderInfo).then(async () => {
                updateOrder(orderInfo);
                const {shipping_charges} = this.state;
                if(!(await isApplePaySupported())){
                    return showErrorAlert(I18n.t('ApplePay_is_not_supported'));
                }

                const total_price = order.total + shipping_charges;
                let cartItems = cart.map(c => ({label: I18n.locale === 'ja'?c.name_kana:c.name, amount: c.price.toFixed(2)}));
                cartItems.push({label: I18n.t('Tax'), amount: order.tax.toFixed(2)});
                cartItems.push({label: I18n.t('Shipping_charges'), amount: shipping_charges.toFixed(2)});
                cartItems.push({label: I18n.t('Total'), amount: total_price.toFixed(2)});
                console.log('cardItems', cartItems);

                const payResult = await presentApplePay({
                    cartItems,
                    country: 'US',
                    currency: 'USD'
                })

                if(payResult.error){
                    console.log('error', payResult);
                    //return showToast(I18n.t('Purchase_failed'));
                } else {
                    firebaseSdk.createPaymentIntent(total_price).then(async (paymentIntent) => {
                        const result = await confirmApplePayPayment(
                            paymentIntent.client_secret
                        );
                        if (result.error) {
                            return showToast(I18n.t('Purchase_failed'));
                        }

                        showToast(I18n.t('Purchase_success'));
                        this.completePay();
                    }).catch((err) => {
                        showToast(I18n.t('Purchase_failed'));
                    })
                }
            })
        }
    }

    completePay = () => {
        const {order, clearCart, navigation} = this.props;
        const {shipping_charges} = this.state;
        const updateOrder = {
            id: order.id,
            status: ORDER_STATUS_PAID,
            shipping_charges: shipping_charges,
            purchasedAt: new Date()
        };
        firebaseSdk.setData(firebaseSdk.TBL_ORDER, DB_ACTION_UPDATE, updateOrder).then(() => {
            clearCart();
            navigation.popToTop();
        })
    }

    onGoToShop = () => {
        const {clearCart} = this.props;
        clearCart();
        this.props.navigation.push('Shop');
    }

    render() {
        const {navigation, order, theme} = this.props;
        const { email, name, country, city, address, loading } = this.state;

        return (
            <KeyboardView
                contentContainerStyle={sharedStyles.container}
                keyboardVerticalOffset={128}
            >
                <StatusBar/>
                <LinearGradient colors={[HEADER_BAR_START, HEADER_BAR_END]} style={sharedStyles.topLinearGradient} angle={90} useAngle/>
                <SafeAreaView>
                    <ScrollView style={{flex: 1}} {...scrollPersistTaps} contentContainerStyle={styles.container}>
                        {loading && <ActivityIndicator absolute theme={theme} size={'large'}/>}
                        <Text style={styles.shippingTitle}>{I18n.t('Shipping_info_title')}</Text>
                        <View style={styles.shippingContainer}>
                            <Text style={styles.orderTitle}>{I18n.t('Order_no')} {order.id}</Text>
                            <View style={styles.shippingContent}>
                                <CustomTextInput
                                    inputRef={(e) => {
                                        this.emailInput = e;
                                    }}
                                    label={I18n.t('Email_for_order')}
                                    value={email}
                                    onChange={email => this.setState({email})}
                                    onSubmitEditing={() => {
                                        this.nameInput.focus();
                                    }}
                                    type={'text'}
                                />
                                <CustomTextInput
                                    inputRef={(e) => {
                                        this.nameInput = e;
                                    }}
                                    label={I18n.t('Name')}
                                    value={name}
                                    onChange={name => this.setState({name})}
                                    onSubmitEditing={() => {
                                        this.countyInput.focus();
                                    }}
                                    type={'text'}
                                />
                                <CustomTextInput
                                    inputRef={(e) => {
                                        this.countyInput = e;
                                    }}
                                    label={I18n.t("Country")}
                                    value={country}
                                    onChange={country => this.setState({country})}
                                    onSubmitEditing={() => {
                                        this.zipCodeInput.focus();
                                    }}
                                    type={'text'} />
                                <CustomTextInput
                                    inputRef={(e) => {
                                        this.zipCodeInput = e;
                                    }}
                                    label={I18n.t("Zip_code")}
                                    onChange={zip => this.setState({zip})}
                                    onSubmitEditing={() => {
                                        this.prefectureInput.focus();
                                    }}
                                    type={'text'} />
                                <CustomTextInput
                                    inputRef={(e) => {
                                        this.prefectureInput = e;
                                    }}
                                    label={I18n.t("Prefectures")}
                                    onChange={prefectures => this.setState({prefectures})}
                                    onSubmitEditing={() => {
                                        this.cityInput.focus();
                                    }}
                                    type={'text'} />
                                <CustomTextInput
                                    inputRef={(e) => {
                                        this.cityInput = e;
                                    }}
                                    label={I18n.t("City")}
                                    value={city}
                                    onChange={city => this.setState({city})}
                                    onSubmitEditing={() => {
                                        this.addressInput.focus();
                                    }}
                                    type={'text'} />
                                <CustomTextInput
                                    inputRef={(e) => {
                                        this.addressInput = e;
                                    }}
                                    label={I18n.t("Address")}
                                    value={address}
                                    onChange={address => this.setState({address})}
                                    type={'address'}
                                    multiline={true}
                                />
                                <CustomTextInput
                                    inputRef={(e) => {
                                        this.contactInput = e;
                                    }}
                                    label={I18n.t("Contact_no")}
                                    onChange={contact_no => this.setState({contact_no})}
                                    type={'text'}
                                />
                            </View>
                        </View>
                        <Text style={styles.noteStyle}>{I18n.t('Estimated_delivery')}</Text>
                        <TouchableOpacity style={[styles.actionSecondaryBtn, {backgroundColor: 'grey'}]} onPress={() => this.onGoToShop()}>
                            <Text style={styles.actionText}>{I18n.t('Go_back_to_shopping_page')}</Text>
                        </TouchableOpacity>
                        <View style={styles.actionContainer}>
                            <View style={styles.actionLabel}>
                                <Text style={styles.proceedPay}>{I18n.t('Proceed_payment_with')}</Text>
                            </View>
                            <View style={styles.actionBtns}>
                                <TouchableOpacity style={[styles.creditPayBtn, {backgroundColor: COLOR_YELLOW, alignItems: 'center', flexDirection: 'row', justifyContent: 'center'}]} onPress={() => this.onPayCredit()}>
                                    <Image source={images.credit} style={styles.btnIcon}/>
                                    <Text style={styles.actionText}>Credit Card</Text>
                                </TouchableOpacity>
                                <ApplePayButton
                                    onPress={this.onPayApple}
                                    type="plain"
                                    buttonStyle="black"
                                    borderRadius={4}
                                    style={{
                                        width: '48%',
                                        height: 40,
                                        marginTop: 8
                                    }}
                                />
                            </View>
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </KeyboardView>
        );
    }
}

const mapStateToProps = state => ({
    user: state.login.user,
    order: state.cart.order,
    cart: state.cart.cart
})

const mapDispatchToProps = dispatch => ({
    updateOrder: params => dispatch(updateOrderAction(params)),
    clearCart: params => dispatch(clearCartAction(params))
})

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(ShippingView));
