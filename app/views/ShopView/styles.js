import { StyleSheet } from "react-native";
import {COLOR_BLACK, COLOR_ORANGE, COLOR_WHITE} from '../../constants/colors';

export default StyleSheet.create({
    header: {
        height: 300
    },
    swiperContainer: {

    },
    slides: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },
    slideImage: {
        width: '100%',
        height: 260,
        borderRadius: 12,
        resizeMode: 'cover'
    },
    topCategoryTitle: {
        fontSize: 14,
        lineHeight: 26,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    dot: {
        backgroundColor: COLOR_WHITE,
        borderColor: COLOR_WHITE,
        borderWidth: 1,
        width: 10,
        height: 10,
        borderRadius: 5,
        marginLeft: 3,
        marginRight: 3,
        marginTop: 3,
        marginBottom: 3
    },
    activeDot: {
        backgroundColor: COLOR_BLACK,
        borderColor: COLOR_WHITE,
        borderWidth: 1,
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    topCategoryContainer: {
        marginVertical: 12,
    },
    subCategoryContainer: {
        marginHorizontal: 8
    },
    categoryImageContainer: {

    },
    categoryImage: {
        width: 160,
        height: 160,
        borderRadius: 12,
        borderColor: 'grey',
        borderWidth: StyleSheet.hairlineWidth,
    },
    categoryInfo: {
        marginTop: 4,
    },
    categoryKanaTitle: {
        fontSize: 10,
        width: 160
    },
    categoryTitle: {
        fontSize: 10,
    },
    productContainer: {
        marginVertical: 8,
        alignItems: 'center'
    },
    productImageContainer: {

    },
    productImage: {
        width: 120,
        height: 120,
        borderRadius: 12,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: 'grey'
    },
    productInfo: {
    },
    productKanaTitle: {
        textAlign: 'center'
    },
    productTitle: {
        textAlign: 'center',
        fontSize: 12
    },
    productPrice: {
        textAlign: 'center'
    }
});
