import React from 'react';
import PropTypes from "prop-types";
import StatusBar from "../../containers/StatusBar";
import {withTheme} from "../../theme";
import {ImageBackground, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import styles from "./styles";
import {clearCart as clearCartAction, createOrder as createOrderAction} from '../../actions/cart';
import {connect} from "react-redux";
import MainScreen from '../../containers/MainScreen';
import * as HeaderButton from '../../containers/HeaderButton';
import ActivityIndicator from '../../containers/ActivityIndicator';
import Product from './Product';
import {GradientHeader} from '../../containers/GradientHeader';
import {COLOR_GRAY, COLOR_YELLOW} from '../../constants/colors';
import scrollPersistTaps from '../../utils/scrollPersistTaps';
import I18n from '../../i18n';
import firebaseSdk, {DB_ACTION_ADD, ORDER_STATUS_PENDING} from '../../lib/firebaseSdk';

class CheckOutView extends React.Component {
    static navigationOptions = ({navigation}) => ({
        headerLeft: () => <HeaderButton.Drawer navigation={navigation} testID='nav-drawer' />,
        title: I18n.t('Order_overview'),
        headerBackground: () => <GradientHeader/>
    })

    static propTypes = {
        cart: PropTypes.array,
        createOrder: PropTypes.func,
        clearCart: PropTypes.func,
        user: PropTypes.object,
        theme: PropTypes.string,
    }

    constructor(props) {
        super(props);
        this.mounted = false;
        this.state = {
            tax: 0,
            loading: true,
        }
        this.init();
    }

    componentDidMount() {
        this.mounted = true;
    }

    init = async () => {
        firebaseSdk.getOptionData(firebaseSdk.OPTION_TAX).then(config => {
            this.setState({loading: false, tax: (config && config.data)?config.data:0});
        }).catch(err => {
            this.setState({loading: false});
        })
    }

    onPressProduct = (product) => {
        const {navigation} = this.props;
        navigation.replace('ProductDetail', {product});
    }

    renderSlides = () => {
        let sides = [];
        const {category} = this.state;
        category.images.forEach(c => {
            sides.push(<ImageBackground source={{uri: c}} style={styles.slides} key={c.id}/>);
        })
        return sides;
    }

    onClearCart = () => {
        const { clearCart, navigation } = this.props;
        clearCart();
    }

    onShipping = () => {
        const {user, createOrder, cart} = this.props;
        const {tax} = this.state;
        let product_cost = 0;
        cart.forEach(o => product_cost += o.price * o.quantity);
        let total_tax = product_cost * tax / 100;

        this.setState({loading: true});
        const orderInfo = {
            userId: user.userId,
            sub_total: product_cost,
            tax: total_tax,
            total: product_cost + total_tax,
            status: ORDER_STATUS_PENDING,
            orderItems: cart,
            shippingDetails: {},
            createdAt: new Date()
        }
        firebaseSdk.setData(firebaseSdk.TBL_ORDER, DB_ACTION_ADD, orderInfo).then((order) => {
            this.setState({loading: false});
            createOrder(order);
            this.props.navigation.replace('Shipping');
        })
    }

    render() {
        const {navigation, cart, theme} = this.props;
        const {tax, loading} = this.state;

        let product_cost = 0;
        cart.forEach(o => product_cost += o.price * o.quantity);
        let total_tax = product_cost * tax / 100;

        return (
            <MainScreen navigation={navigation}>
                <StatusBar/>
                <ScrollView style={{flex: 1}} {...scrollPersistTaps} contentContainerStyle={styles.container}>
                    { loading && <ActivityIndicator absolute size="large" theme={theme}/> }
                    <Text style={styles.overviewTitle}>{I18n.t('Shipping_title')}</Text>
                    <View style={styles.orderContent}>
                        {
                            cart.map(p =>  <Product key={p.id} item={p} onPressItem={() => this.onPressProduct(p)}/>)
                        }
                    </View>
                    <View style={styles.totalContainer}>
                        <View style={styles.totalItem}><Text style={styles.totalTitle}>{I18n.t('Product_cost')}: </Text><Text style={styles.totalValue}>${product_cost}</Text></View>
                        <View style={styles.totalItem}><Text style={styles.totalTitle}>{I18n.t('Tax')}: </Text><Text style={styles.totalValue}>${total_tax}</Text></View>
                        <View style={styles.totalItem}><Text style={styles.totalTitle}>{I18n.t('Total')}: </Text><Text style={styles.totalValue}>${product_cost + total_tax}</Text></View>
                    </View>
                    <Text style={styles.noteStyle}>{I18n.t('Shipping_note')}</Text>
                    <View style={styles.actionContainer}>
                        <TouchableOpacity style={[styles.actionSecondaryBtn, {backgroundColor: 'grey'}]} disabled={!cart.length} onPress={() => this.onClearCart()}>
                            <Text style={styles.actionText}>{I18n.t('Clear_cart')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.actionSecondaryBtn, {backgroundColor: 'grey', marginTop: 8}]} onPress={() => {navigation.replace('Shop')}}>
                            <Text style={styles.actionText}>{I18n.t('Go_back_to_shopping_page')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.actionPrimaryBtn, {backgroundColor: !cart.length?COLOR_GRAY:COLOR_YELLOW}]} disabled={!cart.length} onPress={() => this.onShipping()}>
                            <Text style={styles.actionText}>{I18n.t('Proceed_to_shipping')}</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </MainScreen>
        )
    }
}

const mapStateToProps = state => ({
    user: state.login.user,
    cart: state.cart.cart
})

const mapDispatchToProps = dispatch => ({
    createOrder: params => dispatch(createOrderAction(params)),
    clearCart: params => dispatch(clearCartAction(params))
})

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(CheckOutView));
