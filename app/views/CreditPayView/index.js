import React from 'react';
import PropTypes from "prop-types";
import StatusBar from "../../containers/StatusBar";
import {withTheme} from "../../theme";
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import styles from "./styles";
import {clearCart as clearCartAction} from "../../actions/cart";
import {setUser as setUserAction} from "../../actions/login";
import {connect} from "react-redux";
import {createPaymentMethod, CardField, confirmPayment} from '@stripe/stripe-react-native';
import firebaseSdk, {
    DB_ACTION_UPDATE, MAIL_TYPE_CREATE_ORDER,
    ORDER_STATUS_CANCEL,
    ORDER_STATUS_PAID,
} from '../../lib/firebaseSdk';
import {showToast} from '../../lib/info';
import {GradientHeader} from '../../containers/GradientHeader';
import {COLOR_YELLOW, HEADER_BAR_END, HEADER_BAR_START} from '../../constants/colors';
import scrollPersistTaps from '../../utils/scrollPersistTaps';
import sharedStyles from '../Styles';
import KeyboardView from '../../containers/KeyboardView';
import SafeAreaView from '../../containers/SafeAreaView';
import LinearGradient from 'react-native-linear-gradient';
import I18n from '../../i18n';
import RNFetchBlob from 'rn-fetch-blob';
import {CLOUD_URL} from '../../constants/app';
import ActivityIndicator from '../../containers/ActivityIndicator';

class CreditPayView extends React.Component {
    static navigationOptions = ({navigation}) => ({
        title: I18n.t('Credit_card_payment'),
        headerBackground: () => <GradientHeader/>
    })

    static propTypes = {
        clearCart: PropTypes.func,
        order: PropTypes.object,
        user: PropTypes.object,
        theme: PropTypes.string,
    }

    constructor(props) {
        super(props);
        this.mounted = false;
        this.state = {
            loading: true,
            shipping_charges: 0,
            cardDetails: props.user.cardDetails??{}
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

    onSubmit = () => {
        const {user, setUser} = this.props;
        this.setState({loading: true});
        if (!user.payment_method_id || !user.stripe_customer_id) {
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
                    setUser({...updates, stripe_customer_id: customer.id});
                    this.confirmPayment();
                }).catch(err => {
                    this.setState({loading: false});
                })
            }).catch(() => {
                this.setState({loading: false});
            })
        } else {
            this.confirmPayment();
        }
    }

    confirmPayment = async () => {
        const {user, order} = this.props;
        const {shipping_charges} = this.state;
        const allPrice = order.total + shipping_charges;
        const apiUrl = `${CLOUD_URL}/createPaymentIntentByCustomer?user_id=${user.id}&amount=${allPrice}`;
        console.log('API CALL', apiUrl);
        const res =
            await RNFetchBlob.fetch('GET', apiUrl)
                .then(response => {
                return response.json();
            })
            .catch(e => {
                return null;
            })

        console.log('paymentIntent', res);
        if(!res){
            showToast(I18n.t('Purchase_failed'));
            this.setState({loading: false});
            return;
        }

        switch (res.status){
            case 'succeeded':
                this.completePay(res.id);
                showToast(I18n.t('Purchase_success'));
                break;
            case 'requires_action':
                {
                    confirmPayment(res.client_secret, {
                        type: 'Card',
                        paymentMethodId: res.payment_method
                    }).then((confirmPaymentResult) => {
                        console.log('confirm payment', confirmPaymentResult);
                        if(!confirmPaymentResult.error){
                            this.completePay(res.id);
                            showToast(I18n.t('Purchase_success'));
                        } else {
                            showToast(confirmPaymentResult.error.localizedMessage);
                        }
                        this.setState({loading: false});
                    }).catch(err => {
                        console.log('error', err);
                        this.setState({loading: false});
                        showToast(I18n.t('Purchase_failed'));
                    })
                    break;
                }
            default:
                console.log('error status', res.status);
                this.setState({loading: false});
                showToast(I18n.t('Purchase_failed'));
        }
    }

    completePay = (payment_intent_id) => {
        const {order, clearCart, navigation} = this.props;
        const {shipping_charges} = this.state;
        const updateOrder = {
            id: order.id,
            status: ORDER_STATUS_PAID,
            shipping_charges: shipping_charges,
            payment_intent_id,
            purchasedAt: new Date()
        };
        firebaseSdk.setData(firebaseSdk.TBL_ORDER, DB_ACTION_UPDATE, updateOrder).then(async () => {
            firebaseSdk.sendMail(updateOrder.id, MAIL_TYPE_CREATE_ORDER).catch((err)=>{});
            clearCart();
            navigation.popToTop();
        })
    }

    onCancelOrder = () => {
        const {clearCart, navigation, order} = this.props;
        const updateOrder = {
            id: order.id,
            status: ORDER_STATUS_CANCEL
        };
        firebaseSdk.setData(firebaseSdk.TBL_ORDER, DB_ACTION_UPDATE, updateOrder).then(() => {
            clearCart();
            navigation.popToTop();
        })
    }

    render() {
        const {order, user, theme} = this.props;
        const {loading, shipping_charges} = this.state;

        return (
            <KeyboardView
                contentContainerStyle={sharedStyles.container}
                keyboardVerticalOffset={128}
            >
                <StatusBar/>
                <SafeAreaView>
                    <LinearGradient colors={[HEADER_BAR_START, HEADER_BAR_END]} style={sharedStyles.topLinearGradient} angle={90} useAngle/>
                    <ScrollView {...scrollPersistTaps} style={{flex: 1}} contentContainerStyle={styles.container}>
                        { loading && <ActivityIndicator absolute size="large" theme={theme}/> }
                        <View style={styles.orderInfoContainer}>
                            <Text style={styles.orderNo}>{I18n.t('Order_no')} {order.id}</Text>
                            <View style={styles.orderInfo}>
                                <View style={styles.totalItem}><Text style={styles.totalTitle}>{I18n.t('Order_total')}: </Text><Text style={styles.totalValue}>${order.sub_total}</Text></View>
                                <View style={styles.totalItem}><Text style={styles.totalTitle}>{I18n.t('Tax')}: </Text><Text style={styles.totalValue}>${order.tax}</Text></View>
                                <View style={styles.totalItem}><Text style={styles.totalTitle}>{I18n.t('Shipping_charges')}: </Text><Text style={styles.totalValue}>${shipping_charges}</Text></View>
                                <View style={styles.splitLine}/>
                                <View style={styles.totalItem}><Text style={styles.totalTitle}>{I18n.t('Total')}: </Text><Text style={styles.totalValue}>${order.total + shipping_charges}</Text></View>
                            </View>
                        </View>
                        <Text style={styles.noteText}>{I18n.t('Credit_pay_caption')}</Text>
                        {
                            (!user.payment_method_id || !user.stripe_customer_id)?
                                <View style={styles.cardContainer}>
                                <View style={styles.cardContent}>
                                    <Text style={styles.cardTitle}>{I18n.t('Card')}</Text>
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
                                                marginVertical: 4,
                                            }}
                                            onCardChange={(cardDetails) => {
                                                this.setState({cardDetails});
                                            }}
                                        />
                                    </View>
                                </View>
                            </View>
                                :
                            <View style={styles.cardContainer}>
                                <Text style={styles.cardBrand}>{user.cardDetails.brand}</Text>
                                <Text style={styles.cardNumber}>**** **** **** {user.cardDetails.last4}</Text>
                                <Text style={styles.cardExpiry}>{user.cardDetails.expiryMonth}/{user.cardDetails.expiryYear}</Text>
                            </View>
                        }

                        <View style={styles.actionContainer}>
                            <TouchableOpacity style={[styles.actionSecondaryBtn, {backgroundColor: 'grey'}]} onPress={() => this.onCancelOrder()}>
                                <Text style={styles.actionText}>{I18n.t('Cancel_order')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.actionPrimaryBtn, {backgroundColor: COLOR_YELLOW}]} onPress={this.onSubmit}>
                                <Text style={styles.actionText}>{I18n.t('Make_payment')}</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </KeyboardView>
        )
    }
}

const mapStateToProps = state => ({
    user: state.login.user,
    order: state.cart.order
})

const mapDispatchToProps = dispatch => ({
    setUser: params => dispatch(setUserAction(params)),
    clearCart: params => dispatch(clearCartAction(params))
})

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(CreditPayView));
