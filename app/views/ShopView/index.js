import React from 'react';
import PropTypes from "prop-types";
import Swiper from 'react-native-swiper';
import StatusBar from "../../containers/StatusBar";
import {withTheme} from "../../theme";
import {FlatList, Image, ScrollView, Text, View} from 'react-native';
import styles from "./styles";
import {setUser as setUserAction} from "../../actions/login";
import {connect} from "react-redux";
import MainScreen from '../../containers/MainScreen';
import * as HeaderButton from '../../containers/HeaderButton';
import Product from './Product';
import {GradientHeader} from '../../containers/GradientHeader';
import scrollPersistTaps from '../../utils/scrollPersistTaps';
import I18n from '../../i18n';
import firestore from '@react-native-firebase/firestore';
import firebaseSdk from '../../lib/firebaseSdk';

class ShopView extends React.Component {
    static navigationOptions = ({navigation}) => ({
        headerLeft: () => <HeaderButton.Drawer navigation={navigation} testID='nav-drawer' />,
        title: 'VIP Billionaires ' + I18n.t('Shop'),
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
            refreshing: false,
            loading: true,
            updating: false,
            currentIndex: 0,
            topProducts: [],
            products: []
        }
        this.init();
    }

    componentDidMount() {
        this.mounted = true;
    }

    componentWillUnmount() {
        if(this.unSubscribeProduct){
            this.unSubscribeProduct();
        }
    }

    init = async () => {
        if(this.unSubscribeProduct){
            this.unSubscribeProduct();
        }

        firebaseSdk.getOptionData(firebaseSdk.OPTION_HEADER_ITEMS).then(headerItems => {
            const items = headerItems.data?headerItems.data.sort((a, b) => a.order - b.order):[];
            this.setState({topProducts: items});
        })
        let productSubscribe = await firestore().collection(firebaseSdk.TBL_PRODUCTS);
        this.unSubscribeProduct = productSubscribe.onSnapshot(async (querySnapShot) => {
            let list = [];
            querySnapShot.forEach(doc => {
                const product = doc.data();
                list.push({id: doc.id, ...product});
            });

            if (this.mounted) {
                this.setState({products: list, refreshing: false});
            } else {
                this.state.products = list;
                this.state.refreshing = false;
            }
            console.log('products', list);
        })
    }

    renderSlides = () => {
        let sides = [];
        const {topProducts} = this.state;
        topProducts.forEach(c => {
            sides.push(<View style={styles.slides} key={c.id}>
                <Image source={{uri: c.image_url}} style={styles.slideImage}/>
            </View>);
        })
        return sides;
    }

    onPressItem = (item) => {
        this.props.navigation.replace('ProductDetail', {product: item});
    }

    render() {
        const {navigation, theme} = this.props;
        const {topProducts, products, currentIndex, updating} = this.state;

        return (
            <MainScreen navigation={navigation}>
                <StatusBar/>
                <ScrollView style={{flex: 1, marginBottom: 80}} {...scrollPersistTaps}>
                    <View style={styles.header}>
                        <Swiper
                            loop={false}
                            ref={ref => this.swipe = ref}
                            onIndexChanged={(index) => this.setState({currentIndex: index})}
                            activeDotStyle={styles.activeDot}
                            containerStyle={styles.swiperContainer}
                            dotStyle={styles.dot}
                            paginationStyle={{position: 'absolute', bottom: 10}}
                        >
                            {this.renderSlides()}
                        </Swiper>
                        <Text style={styles.topCategoryTitle}>{topProducts[currentIndex]?.label??''}</Text>
                    </View>
                    <View style={{alignItems: 'center', marginTop: 12}}>
                        {
                            products.map(p => <Product item={p} onPressItem={() =>this.onPressItem(p)}/>)
                        }
                    </View>
                </ScrollView>
            </MainScreen>
        )
    }
}

const mapStateToProps = state => ({
    user: state.login.user
})

const mapDispatchToProps = dispatch => ({
    setUser: params => dispatch(setUserAction(params))
})

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(ShopView));
