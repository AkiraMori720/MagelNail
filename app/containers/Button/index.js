import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

import {
	COLOR_BUTTON_PRIMARY,
	COLOR_BUTTON_SECONDARY,
	COLOR_BUTTON_DEFAULT,
	COLOR_BUTTON_DANGER,
	COLOR_BUTTON_WHITE,
	COLOR_BUTTON_GRAY,
	COLOR_BUTTON_DONE,
	COLOR_BUTTON_FACEBOOK,
	COLOR_BUTTON_GOOGLE,
	COLOR_BUTTON_TEXT_PRIMARY,
	COLOR_BUTTON_TEXT_SECONDARY,
	COLOR_BUTTON_TEXT_DEFAULT,
	COLOR_BUTTON_TEXT_DANGER,
	COLOR_BUTTON_TEXT_WHITE,
	COLOR_BUTTON_TEXT_DONE,
	COLOR_BUTTON_TEXT_FACEBOOK,
	COLOR_BUTTON_TEXT_GOOGLE,
	themes,
	COLOR_BUTTON_APPLE_LIGHT,
	COLOR_BUTTON_APPLE_DARK,
	COLOR_BUTTON_APPLE_BLACK,
	COLOR_BUTTON_TEXT_APPLE_LIGHT,
	COLOR_BUTTON_TEXT_APPLE_DARK,
	COLOR_ORANGE, COLOR_WHITE, NAV_BAR_START, NAV_BAR_END, BUTTON_GRADIENT_END, BUTTON_GRADIENT_START,
} from '../../constants/colors';
import sharedStyles from '../../views/Styles';
import images from "../../assets/images";
import LinearGradient from 'react-native-linear-gradient';

/* eslint-disable react-native/no-unused-styles */
const styles = StyleSheet.create({
	container: {
		borderRadius: 30,
		backgroundColor: COLOR_WHITE,
	},
	oauthButtonContainer: {
		margin: 12
	},
	oauthBtn: {
		width: 60,
		height: 60,
		resizeMode: 'contain'
	},
	gradientButtonContainer: {
		width: '100%'
	},
	gradientButtonText: {
		borderRadius: 24,
		height: 48,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		paddingHorizontal: 16,
	},
	buttonContainer: {
		borderRadius: 24,
		height: 48,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		paddingHorizontal: 16,
		borderWidth: 1.5,
		borderColor: '#C5C5C5'
	},
	oauthIcon: {
		width: 19,
		height: 19,
		marginRight: 4,
		resizeMode: 'contain'
	},
	icon: {
		position: 'absolute',
		left: 7.5,
		top: 7.5,
		width: 35,
		height: 35,
		resizeMode: 'contain'
	},
	text: {
		...sharedStyles.textMedium,
		fontSize: 16,
		letterSpacing: 1.6,
		textAlign: 'center'
	},
	shadow: {
		shadowColor: '#000',
		shadowRadius: 2,
		shadowOpacity: 0.4,
		shadowOffset: {
			width: 0,
			height: 2
		},
		elevation: 8
	},
	background_primary: {
		backgroundColor: COLOR_BUTTON_PRIMARY
	},
	background_secondary: {
		backgroundColor: COLOR_BUTTON_SECONDARY
	},
	background_default: {
		backgroundColor: COLOR_BUTTON_DEFAULT
	},
	background_danger: {
		backgroundColor: COLOR_BUTTON_DANGER
	},
	background_white: {
		backgroundColor: COLOR_BUTTON_WHITE,
		borderWidth: 1,
		borderColor: '#C5C5C5'
	},
	background_grey: {
		backgroundColor: COLOR_BUTTON_GRAY,
		borderWidth: 1,
		borderColor: '#C5C5C5'
	},
	background_done: {
		backgroundColor: COLOR_BUTTON_DONE
	},
	background_facebook: {
		backgroundColor: COLOR_BUTTON_FACEBOOK
	},
	background_google: {
		backgroundColor: COLOR_BUTTON_GOOGLE
	},
	background_apple_light: {
		backgroundColor: COLOR_BUTTON_APPLE_LIGHT
	},
	background_apple_dark: {
		backgroundColor: COLOR_BUTTON_APPLE_DARK
	},
	background_apple_black: {
		backgroundColor: COLOR_BUTTON_APPLE_BLACK
	},
	text_color_primary: {
		color: COLOR_BUTTON_TEXT_PRIMARY
	},
	text_color_secondary: {
		color: COLOR_BUTTON_TEXT_SECONDARY
	},
	text_color_default: {
		color: COLOR_BUTTON_TEXT_DEFAULT
	},
	text_color_danger: {
		color: COLOR_BUTTON_TEXT_DANGER
	},
	text_color_white: {
		color: COLOR_BUTTON_TEXT_WHITE
	},
	text_color_done: {
		color: COLOR_BUTTON_TEXT_DONE
	},
	text_color_facebook: {
		color: COLOR_BUTTON_TEXT_FACEBOOK
	},
	text_color_google: {
		color: COLOR_BUTTON_TEXT_GOOGLE
	},
	text_color_apple_light: {
		color: COLOR_BUTTON_TEXT_APPLE_LIGHT
	},
	text_color_apple_dark: {
		color: COLOR_BUTTON_TEXT_APPLE_DARK
	},

	button_size_Z: {
		width: 335
	},
	button_size_Y: {
		width: 201
	},
	button_size_X: {
		width: 125
	},
	button_size_W: {
		width: '100%'
	},
	button_size_V: {
		width: 125
	},
	button_size_U: {
		width: 140
	},
	button_size_T: {
		width: 313
	},
	button_size_S: {
		width: 345
	},

	font_weight_regular: {
		...sharedStyles.textRegular
	},
	font_weight_medium: {
		...sharedStyles.textMedium
	},
	font_weight_semibold: {
		...sharedStyles.textSemibold
	},
	font_weight_bold: {
		...sharedStyles.textBold
	}
});

export default class Button extends React.PureComponent {
	static propTypes = {
		title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
		text: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
		icon: PropTypes.string,
		iconCenter: PropTypes.func,
		type: PropTypes.string,
		size: PropTypes.string,
		onPress: PropTypes.func,
		hidden: PropTypes.bool,
		disabled: PropTypes.bool,
		width: PropTypes.string,
		height: PropTypes.string,
		backgroundColor: PropTypes.string,
		loading: PropTypes.bool,
		style: PropTypes.any,
		textColor: PropTypes.string,
		fontWeight: PropTypes.string,
		theme: PropTypes.string,
	}

	static defaultProps = {
		title: 'Press me!',
		type: 'primary',
		size: 'Z',
		onPress: () => alert('It works!'),
		icon: null,
		hidden: false,
		disabled: false,
		loading: false
	}

	render() {
		const {
			title, text, icon, type, size, onPress, iconCenter,
			hidden, disabled, width, height, backgroundColor,
			loading, style, textColor : color, fontWeight, theme,
			...otherProps
		} = this.props;

		if (hidden) {
			return null;
		}

		if(type === 'oauth'){
			return (<RectButton
				onPress={onPress}
				style={styles.oauthButtonContainer}
			>
				<Image source={images[('icon_' + title)]} style={styles.oauthBtn}/>
			</RectButton>);
		}

		if(type === 'gradient'){
			return (<RectButton onPress={onPress} style={[styles.gradientButtonContainer, style]} enabled={!(disabled || loading)}>
				<LinearGradient colors={[BUTTON_GRADIENT_START, BUTTON_GRADIENT_END]} style={[styles.gradientButtonText, size ? styles[`button_size_${ size }`] : {}]}>
					{
						loading
							? <ActivityIndicator color={'white'}/>
							: <>
								{iconCenter ? iconCenter() : null}
								<Text style={{
									...(styles.text),
									color: disabled?themes[theme].auxiliaryText:'white',
									fontWeight: (fontWeight ? styles[`font_weight_${fontWeight}`] : 'normal')
								}}>{text || title}</Text>
							</>
					}
				</LinearGradient>
			</RectButton>);
		}

		return (
			<RectButton
				onPress={onPress}
				enabled={!(disabled || loading)}
				style={[
					styles.container,
					size ? styles[`button_size_${ size }`] : {},
					style
				]}
				{...otherProps}
			>
				<View style={[
					styles.buttonContainer,
					size ? styles[`button_size_${ size }`] : {},
					width ? { width } : {},
					height ? { height } : {}
				]}
				>
					{
						icon ? <FontAwesomeIcon name={icon} size={24} style={{ marginRight: 8, color: 'black'}}/> : null
					}
					{
						loading
							? <ActivityIndicator color={color??themes[theme].buttonText}/>
							:<>
								{iconCenter?iconCenter(): null}
							<Text style={{ ...(styles.text), color: disabled?themes[theme].auxiliaryText:themes[theme].infoText , fontWeight: (fontWeight ? styles[`font_weight_${ fontWeight }`] : 'normal')}}>{ text || title }</Text>
							</>
					}
				</View>
			</RectButton>
		);
	}
}
