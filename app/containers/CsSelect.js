import React, { useState } from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import PropTypes from 'prop-types';
import RNPickerSelect from 'react-native-picker-select';

import sharedStyles from '../views/Styles';
import { themes } from '../constants/colors';
import { isIOS } from '../utils/deviceInfo';
import {VectorIcon} from './VectorIcon';

const styles = StyleSheet.create({
	container: {
		marginBottom: 10,
	},
	label: {
		fontSize: 14,
		width: 80,
		paddingLeft: 8,
		paddingVertical: 4,
		...sharedStyles.textSemibold
	},
	iosPadding: {
		height: 36,
		justifyContent: 'center',
	},
	wrap: {
		position: 'relative'
	},
	viewContainer: {
		justifyContent: 'center',
		borderRadius: 24,
		borderWidth: 1,
		flexGrow: 1,
	},
	pickerText: {
		...sharedStyles.textRegular,
		textAlign: 'center',
		fontSize: 14,
		paddingHorizontal: isIOS?8:14,
	},
	icon: {
		marginRight: 12
	},
	iosIcon: {
		paddingVertical: 10
	},
	loading: {
		padding: 0
	},
	iconStyle: {
		position: 'absolute',
		right: 12,
		paddingVertical: 8
	}
});

export const CsSelect = React.memo(({
	label,
	containerStyle,
	options = [],
	placeholder,
	onChange,
	disabled,
	value: initialValue,
	theme
}) => {
	const [selected, setSelected] = useState(!Array.isArray(initialValue) && (initialValue === 0?-1:initialValue));
	const items = options.map(option => ({ label: option.text, value: (option.value ===0)?-1:option.value }));
	const pickerStyle = {
		...styles.viewContainer,
		...(isIOS ? styles.iosPadding : {}),
		borderColor: themes[theme].separatorColor,
		backgroundColor: themes[theme].backgroundColor
	};

	return (
		<View style={[styles.container, containerStyle]}>
			{label ? (
					<Text
						contentDescription={null}
						accessibilityLabel={null}
						style={[
							styles.label,
							{ color: themes[theme].infoText }
						]}
					>
						{label}
					</Text>
				) : null}
			<View style={styles.wrap}>
				<RNPickerSelect
					items={items}
					placeholder={placeholder ? { label: placeholder, value: null } : {}}
					useNativeAndroidPickerStyle={false}
					value={selected}
					disabled={disabled}
					onValueChange={(value) => {
						setSelected(value);
						onChange(value === -1?0:value);
					}}
					style={{
						viewContainer: pickerStyle,
						inputAndroidContainer: pickerStyle
					}}
					textInputProps={{ style: { ...styles.pickerText, color: selected ? themes[theme].sideTitleText : themes[theme].auxiliaryText } }}
				/>
				<VectorIcon type={"FontAwesome5"} name={"chevron-down"} color={themes[theme].infoText} size={20} style={styles.iconStyle}/>
			</View>
		</View>
	);
});

CsSelect.propTypes = {
	options: PropTypes.array,
	placeholder: PropTypes.string,
	onChange: PropTypes.func,
	loading: PropTypes.bool,
	disabled: PropTypes.bool,
	value: PropTypes.array,
	theme: PropTypes.string
};
