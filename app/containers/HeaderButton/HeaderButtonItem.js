import React from 'react';
import {Text, StyleSheet, Platform, TouchableOpacity, View} from 'react-native';
import PropTypes from 'prop-types';

import { withTheme } from '../../theme';
import {COLOR_WHITE, COLOR_YELLOW, themes} from '../../constants/colors';
import sharedStyles from '../../views/Styles';
import {VectorIcon} from "../VectorIcon";

export const BUTTON_HIT_SLOP = {
	top: 5, right: 5, bottom: 5, left: 5
};

const styles = StyleSheet.create({
	container: {
		marginHorizontal: 8,
		flexDirection: 'row',
		alignItems: 'center'
	},
	headerTitleContainer: {
		paddingVertical: 4,
		paddingHorizontal: 12,
		borderRadius: 12,
		backgroundColor: '#CB8E6E'
	},
	headerLabelContainer: {

	},
	title: {
		...Platform.select({
			android: {
				fontSize: 16
			},
			default: {
				fontSize: 17
			}
		}),
		...sharedStyles.textSemibold
	},
	label: {
		...Platform.select({
			android: {
				fontSize: 16
			},
			default: {
				fontSize: 17
			}
		}),
		...sharedStyles.textRegular
	},
	icon: {
		padding: 4
	}
});

const Item = ({
	title, titleStyle, iconName, onPress, testID, theme, badge, vector, size, label
}) => (
	<TouchableOpacity onPress={onPress} testID={testID} hitSlop={BUTTON_HIT_SLOP} style={styles.container}>
		<>
			{
				iconName
					? <VectorIcon type={vector} name={iconName} size={size??24} color={titleStyle ? themes[theme].headerTitleColor : themes[theme].headerTintColor} />
					: <View style={[styles.headerTitleContainer]}>
						<Text style={[styles.title, { color: 'white' }]}>{title}</Text>
					</View>
			}
			{
				label &&
				<View style={[styles.headerLabelContainer]}>
					<Text style={[styles.label, { color: themes[theme].headerTitleColor }]}>{label}</Text>
				</View>
			}
			{badge ? badge() : null}
		</>
	</TouchableOpacity>
);

Item.propTypes = {
	onPress: PropTypes.func.isRequired,
	title: PropTypes.string,
	titleStyle: PropTypes.bool,
	vector: PropTypes.string,
	iconName: PropTypes.string,
	testID: PropTypes.string,
	label: PropTypes.string,
	theme: PropTypes.string,
	badge: PropTypes.func
};

Item.displayName = 'HeaderButton.Item';

export default withTheme(Item);
