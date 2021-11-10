import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';

import styles from './styles';
import LinearGradient from 'react-native-linear-gradient';
import {NAV_BAR_START, SIDE_BAR_END} from '../../constants/colors';

const Item = React.memo(({
	id, left, text, onPress, current, containerStyle, textStyle
}) => (
	<TouchableOpacity
		key={id}
		onPress={onPress}
		underlayColor='#292E35'
		activeOpacity={0.3}
		style={containerStyle}
	>
		{
			current?<LinearGradient colors={[NAV_BAR_START, SIDE_BAR_END]} style={styles.item} angle={90} useAngle>
				<View style={styles.itemLeft}>
					{left}
				</View>
				<View style={styles.itemCenter}>
					<Text style={[styles.itemText, textStyle]} numberOfLines={2} ellipsizeMode={'tail'}>
						{text}
					</Text>
				</View>
				<View style={styles.itemsRight}/>
			</LinearGradient>
			:
			<View style={styles.item}>
				<View style={styles.itemLeft}>
					{left}
				</View>
				<View style={styles.itemCenter}>
					<Text style={[styles.itemText, textStyle]} numberOfLines={2} ellipsizeMode={'tail'}>
						{text}
					</Text>
				</View>
				<View style={styles.itemsRight}/>
			</View>
		}
	</TouchableOpacity>
));

Item.propTypes = {
	left: PropTypes.element,
	text: PropTypes.string,
	current: PropTypes.bool,
	onPress: PropTypes.func,
	testID: PropTypes.string,
	showSort: PropTypes.bool
};

export default Item;
