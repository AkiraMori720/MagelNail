import React from 'react';
import {View, StyleSheet, Text, TextInput} from 'react-native';
import PropTypes from 'prop-types';

import sharedStyles from '../views/Styles';
import {COLOR_DANGER, COLOR_WHITE, COLOR_YELLOW, themes} from '../constants/colors';
import I18n from '../i18n';
import CheckBox from './CheckBox';
import {Genders} from '../constants/app';

const styles = StyleSheet.create({
	inputContainer: {
		marginBottom: 10,
	},
	label: {
		marginBottom: 4,
		fontSize: 14,
		...sharedStyles.textSemibold
	},
	required: {
		marginBottom: 10,
		color: COLOR_DANGER,
		fontSize: 14,
		fontWeight: '700'
	},
	selectText: {
		...sharedStyles.textRegular,
		fontSize: 14
	},
	wrap: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		borderRadius: 24,
	},
	CheckBoxContainer: {

	}
});

export default class CsSelectGender extends React.PureComponent {
	static propTypes = {
		label: PropTypes.string,
		value: PropTypes.string,
		required: PropTypes.string,
		containerStyle: PropTypes.object,
		onChange: PropTypes.func,
		theme: PropTypes.string
	}

	static defaultProps = {
		theme: 'dark'
	}

	setCheck = (value) => {
		this.props.onChange(value);
	}

	render() {
		const {
			label, value, required, containerStyle, theme
		} = this.props;

		return (
			<View style={[styles.inputContainer, containerStyle]}>
				{label ? (
					<Text
						contentDescription={null}
						accessibilityLabel={null}
						style={[
							styles.label,
							{ color: themes[theme].titleText }
						]}
					>
						{label}
						{required ? <Text contentDescription={null} accessibilityLabel={null} style={[styles.required]}>{` ${ required }`}</Text> : null}
					</Text>
				) : null}
				<View style={[styles.wrap, {backgroundColor: themes[theme].auxiliaryBackground}]}>
					{
						Genders.map(val =>
							<CheckBox
								key={`gender-key-${ val.value }`}
								title={val.text}
								checked={value === val.value}
								onPress={() => this.setCheck(val.value)}
								onIconPress={() => this.setCheck(val.value)}
								checkedIcon='dot-circle-o'
								uncheckedIcon='dot-circle-o'
								checkedColor={COLOR_YELLOW}
								unCheckedColor={themes[theme].bodyText}
								textStyle={{ color: themes[theme].bodyText }}
								containerStyle={{ ...styles.CheckBoxContainer }}
							/>
						)
					}
				</View>
			</View>
		);
	}
}
