import React from 'react';
import {View, StyleSheet, Text, TextInput, Image} from 'react-native';
import PropTypes from 'prop-types';

import sharedStyles from '../views/Styles';
import {COLOR_DANGER, COLOR_MAIN, COLOR_TEXT, COLOR_YELLOW, themes} from '../constants/colors';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {isIOS} from "../utils/deviceInfo";

const styles = StyleSheet.create({
	error: {
		...sharedStyles.textAlignCenter,
		paddingTop: 5
	},
	inputContainer: {
		marginBottom: 10,
	},
	label: {
		marginBottom: 4,
		fontSize: 14,
		textTransform: 'uppercase',
		...sharedStyles.textSemibold
	},
	required: {
		marginBottom: 10,
		color: COLOR_DANGER,
		fontSize: 14,
		fontWeight: '700'
	},
	input: {
		...sharedStyles.textRegular,
		height: 48,
		fontSize: 16,
		paddingHorizontal: isIOS?8:14,
		borderWidth: 1,
		borderRadius: 24,
	},
	inputIconLeft: {
		paddingLeft: 54
	},
	inputIconRight: {
		paddingRight: 45
	},
	wrap: {
		position: 'relative',
		borderRadius: 24,
	},
	iconContainer: {
		position: 'absolute',
		top: 0,
		left: 0,
		width: 48,
		height: 48,
		borderRadius: 24,
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	},
	iconLeft: {
		width: 24,
		height: 24,
		resizeMode: 'contain'
	},
	iconRight: {
		right: 15
	},
	icon: {
		color: '#2F343D'
	},
});

export default class RCTextInput extends React.PureComponent {
	static propTypes = {
		label: PropTypes.string,
		labelStyle: PropTypes.object,
		required: PropTypes.string,
		error: PropTypes.object,
		loading: PropTypes.bool,
		secureTextEntry: PropTypes.bool,
		containerStyle: PropTypes.object,
		inputStyle: PropTypes.object,
		inputRef: PropTypes.func,
		testID: PropTypes.string,
		iconLeft: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
		iconRight: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
		placeholder: PropTypes.string,
		left: PropTypes.element,
		onIconRightPress: PropTypes.func,
		theme: PropTypes.string
	}

	static defaultProps = {
		error: {},
		theme: 'dark'
	}

	state = {
		showPassword: false
	}

	get iconLeft() {
		const { testID, iconLeft, theme } = this.props;
			return (
				<View style={[styles.iconContainer, {backgroundColor: COLOR_MAIN}]}>
					<Image
						source={iconLeft}
						testID={testID ? `${ testID }-icon-left` : null}
						style={[styles.iconLeft, { color: themes[theme].bodyText}]}
					/>
				</View>
			);
	}

	get iconRight() {
		const { iconRight, onIconRightPress, theme } = this.props;
			return (
				<MaterialCommunityIcons
					name={iconRight.icon}
					style={{ color: themes[theme].bodyText }}
					size={18}
				/>
			);
	}

	tooglePassword = () => {
		this.setState(prevState => ({ showPassword: !prevState.showPassword }));
	}

	render() {
		const { showPassword } = this.state;
		const {
			label, labelStyle, left, required, error, loading, secureTextEntry, containerStyle, inputRef, iconLeft, iconRight, inputStyle, testID, placeholder, theme, ...inputProps
		} = this.props;
		const { dangerColor } = themes[theme];
		return (
			<View style={[styles.inputContainer, containerStyle]}>
				{label ? (
					<Text
						contentDescription={null}
						accessibilityLabel={null}
						style={[
							styles.label,
							{ color: themes[theme].infoText },
							error.error && { color: dangerColor },
							labelStyle
						]}
					>
						{label}
						{required ? <Text contentDescription={null} accessibilityLabel={null} style={[styles.required, error.error]}>{` ${ required }`}</Text> : null}
					</Text>
				) : null}
				<View style={styles.wrap}>
					<TextInput
						style={[
							styles.input,
							iconLeft && styles.inputIconLeft,
							(secureTextEntry || iconRight) && styles.inputIconRight,
							{
								borderColor: themes[theme].separatorColor,
								color: themes[theme].titleText
							},
							error.error && {
								color: dangerColor,
								borderColor: dangerColor
							},
							inputStyle
						]}
						ref={inputRef}
						autoCorrect={false}
						autoCapitalize='none'
						underlineColorAndroid='transparent'
						secureTextEntry={secureTextEntry && !showPassword}
						testID={testID}
						accessibilityLabel={placeholder}
						placeholder={placeholder}
						contentDescription={placeholder}
						placeholderTextColor={themes[theme].auxiliaryText}
						theme={'light'}
						{...inputProps}
					/>
					{iconLeft ? this.iconLeft : null}
					{iconRight ? this.iconRight : null}
					{loading ? this.loading : null}
					{left}
				</View>
				{error && error.reason ? <Text style={[styles.error, { color: dangerColor }]}>{error.reason}</Text> : null}
			</View>
		);
	}
}
