import React from 'react';
import {Image, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import styles from './styles';
import scrollPersistTaps from '../../utils/scrollPersistTaps';

const Categories = React.memo(({item, onPressItem, theme}) => (
    <ScrollView horizontal={true} {...scrollPersistTaps} showsHorizontalScrollIndicator={false} contentContainerStyle={styles.topCategoryContainer}>
        {
            item.subCategories.map(sub => (
                <TouchableOpacity style={styles.subCategoryContainer} onPress={onPressItem}>
                    <View style={styles.categoryImageContainer}>
                        <Image source={{uri: item.image_url}} style={styles.categoryImage}/>
                    </View>
                    <View style={styles.categoryInfo}>
                        <Text style={styles.categoryKanaTitle}>{sub.name_kana}</Text>
                        <Text style={styles.categoryTitle}>{sub.name}</Text>
                    </View>
                </TouchableOpacity>
            ))
        }
    </ScrollView>
))

export default Categories;
