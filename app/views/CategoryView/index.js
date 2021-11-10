import React from 'react';
import PropTypes from "prop-types";
import Swiper from 'react-native-swiper';
import StatusBar from "../../containers/StatusBar";
import {withTheme} from "../../theme";
import {ImageBackground, ScrollView, Text, View} from 'react-native';
import styles from "./styles";
import {setUser as setUserAction} from "../../actions/login";
import {connect} from "react-redux";
import MainScreen from '../../containers/MainScreen';
import Product from './Product';


class CategoryView extends React.Component {
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
            refreshing: false,
            loading: true,
            updating: false,
            currentIndex: 0,
            category: {
                    id: 1,
                    name_kana: '太田貴之太田貴之太田貴之',
                    name: 'Belts',
                    image_url: 'https://static.wixstatic.com/media/c07800_79951b3b380448eda84318a06e888886~mv2.png/v1/fill/w_348,h_328,al_c,q_85,usm_0.66_1.00_0.01/IMG_20210226_143902_31fdb4ad-44a3-4866-9.webp',
                    images: [
                        'https://static.wixstatic.com/media/c07800_79951b3b380448eda84318a06e888886~mv2.png/v1/fill/w_348,h_328,al_c,q_85,usm_0.66_1.00_0.01/IMG_20210226_143902_31fdb4ad-44a3-4866-9.webp',
                        'https://static.wixstatic.com/media/c07800_79951b3b380448eda84318a06e888886~mv2.png/v1/fill/w_348,h_328,al_c,q_85,usm_0.66_1.00_0.01/IMG_20210226_143902_31fdb4ad-44a3-4866-9.webp',
                        'https://static.wixstatic.com/media/c07800_79951b3b380448eda84318a06e888886~mv2.png/v1/fill/w_348,h_328,al_c,q_85,usm_0.66_1.00_0.01/IMG_20210226_143902_31fdb4ad-44a3-4866-9.webp',
                        'https://static.wixstatic.com/media/c07800_79951b3b380448eda84318a06e888886~mv2.png/v1/fill/w_348,h_328,al_c,q_85,usm_0.66_1.00_0.01/IMG_20210226_143902_31fdb4ad-44a3-4866-9.webp'
                    ]
                },
            products: [
                {
                    id: 1,
                    name_kana: '太田貴之',
                    name: 'Belts',
                    image_url: 'https://static.wixstatic.com/media/c07800_79951b3b380448eda84318a06e888886~mv2.png/v1/fill/w_348,h_328,al_c,q_85,usm_0.66_1.00_0.01/IMG_20210226_143902_31fdb4ad-44a3-4866-9.webp',
                    price: 190
                },
                {
                    id: 1,
                    name_kana: '太田貴之',
                    name: 'Belts',
                    image_url: 'https://static.wixstatic.com/media/c07800_79951b3b380448eda84318a06e888886~mv2.png/v1/fill/w_348,h_328,al_c,q_85,usm_0.66_1.00_0.01/IMG_20210226_143902_31fdb4ad-44a3-4866-9.webp',
                    price: 190
                },
                {
                    id: 1,
                    name_kana: '太田貴之',
                    name: 'Belts',
                    image_url: 'https://static.wixstatic.com/media/c07800_79951b3b380448eda84318a06e888886~mv2.png/v1/fill/w_348,h_328,al_c,q_85,usm_0.66_1.00_0.01/IMG_20210226_143902_31fdb4ad-44a3-4866-9.webp',
                    price: 190
                },
                {
                    id: 1,
                    name_kana: '太田貴之',
                    name: 'Belts',
                    image_url: 'https://static.wixstatic.com/media/c07800_79951b3b380448eda84318a06e888886~mv2.png/v1/fill/w_348,h_328,al_c,q_85,usm_0.66_1.00_0.01/IMG_20210226_143902_31fdb4ad-44a3-4866-9.webp',
                    price: 190
                },
                {
                    id: 1,
                    name_kana: '太田貴之',
                    name: 'Belts',
                    image_url: 'https://static.wixstatic.com/media/c07800_79951b3b380448eda84318a06e888886~mv2.png/v1/fill/w_348,h_328,al_c,q_85,usm_0.66_1.00_0.01/IMG_20210226_143902_31fdb4ad-44a3-4866-9.webp',
                    price: 190
                },
                {
                    id: 1,
                    name_kana: '太田貴之',
                    name: 'Belts',
                    image_url: 'https://static.wixstatic.com/media/c07800_79951b3b380448eda84318a06e888886~mv2.png/v1/fill/w_348,h_328,al_c,q_85,usm_0.66_1.00_0.01/IMG_20210226_143902_31fdb4ad-44a3-4866-9.webp',
                    price: 190
                }]
        }
        this.init();
    }

    componentDidMount() {
        this.mounted = true;
    }

    init = async () => {

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

    render() {
        const {navigation, theme} = this.props;
        const {category, products} = this.state;

        return (
            <MainScreen navigation={navigation}>
                <StatusBar/>
                <View style={styles.header}>
                    <Swiper
                        loop={false}
                        ref={ref => this.swipe = ref}
                        activeDotStyle={styles.activeDot}
                        containerStyle={styles.swiperContainer}
                        dotStyle={styles.dot}
                        paginationStyle={{position: 'absolute', bottom: 10}}
                    >
                        {this.renderSlides()}
                    </Swiper>
                    <Text style={styles.topCategoryTitle}>{category.name_kana}</Text>
                </View>
                <ScrollView style={{flexGrow: 1, marginBottom: 60, marginTop: 4}}>
                    <View style={{flexDirection: "row", flexWrap: 'wrap', justifyContent: 'center'}}>
                        {
                            products.map(p =>  <Product key={p.id} item={p} onPressItem={() => this.onPressProduct(p)}/>)
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

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(CategoryView));
