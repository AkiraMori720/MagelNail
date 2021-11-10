import React from 'react';
import {Image, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import styles from './styles';
import scrollPersistTaps from '../../utils/scrollPersistTaps';

const Product = React.memo(({item, onPressItem, theme}) => (
    <TouchableOpacity style={styles.productContainer} onPress={onPressItem}>
        <View style={styles.productImageContainer}>
            <Image source={{uri: item.image_url}} style={styles.productImage}/>
        </View>
        <View style={styles.productInfo}>
            <Text style={styles.productKanaTitle}>{item.name_kana}</Text>
            <Text style={styles.productTitle}>{item.name}</Text>
            <Text style={styles.productPrice}>${item.price}</Text>
        </View>
    </TouchableOpacity>
))

export default Product;
