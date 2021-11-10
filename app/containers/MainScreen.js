import React from 'react';
import {
	Image,
	StyleSheet,
	Text,
	TouchableOpacity,
	TouchableWithoutFeedback,
	SafeAreaView,
	View,
} from 'react-native';
import PropTypes from 'prop-types';
import {
	COLOR_WHITE,
	HEADER_BAR_START,
	NAV_BAR_END, NAV_BAR_START,
	themes
} from '../constants/colors';
import { withTheme } from '../theme';
import sharedStyles from '../views/Styles';
import images from '../assets/images';
import {isAndroid, isIOS} from '../utils/deviceInfo';
import Touch from '../utils/touch';
import {withDimensions} from '../dimensions';
import {
	checkCameraPermission,
	checkPhotosPermission,
	imagePickerConfig,
	libraryVideoPickerConfig,
	videoPickerConfig,
} from '../utils/permissions';
import ImagePicker from 'react-native-image-crop-picker';
import {POST_TYPE_PHOTO, POST_TYPE_TEXT, POST_TYPE_VIDEO} from '../constants/app';
import LinearGradient from 'react-native-linear-gradient';
import SearchBox from './SearchBox';
import {connect} from "react-redux";
import I18n from '../i18n';
import * as HeaderButton from "./HeaderButton";

export const Button = isAndroid ? Touch : TouchableOpacity;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		position: 'relative'
	},
	navBar: {
		position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		borderBottomLeftRadius: 32,
		borderBottomRightRadius: 32,
		zIndex: 1
	},
	navBarContainer: {
		borderBottomLeftRadius: 32,
		borderBottomRightRadius: 32,
		paddingBottom: 4,
	},
	navBarInnerContainer: {
		borderBottomLeftRadius: 32,
		borderBottomRightRadius: 32
	},
	navBarContent: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 4,
		flex: 1,
		height: 48
	},
	pageTitle: {
		flexGrow: 1
	},
	pageTitleText: {
		textTransform: 'uppercase',
		fontSize: 16,
		textAlign: 'center'
	},
	mainTabContainer: {
		flex: 1,
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		height: isIOS?72:90,
		paddingTop: 34,
		flexDirection: 'column',
		backgroundColor: 'white'
	},
	topLinearGradient:{
		height: 4
	},
	linearGradient:{
		height: 1
	},
	tabBarContainer: {
		position: 'relative',
		flexGrow: 1,
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center',
		borderTopWidth: StyleSheet.hairlineWidth,
		borderTopColor: '#E5E5E5'
	},
	tabContainer: {
		flexDirection: 'column',
		textAlign: 'center',
		alignItems: 'center',
		width: '25%',
		position: 'relative',
		paddingTop: 8
	},
	unread: {
		position: 'absolute',
		top: 2,
		right: 28,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#1d74f5',
		borderRadius: 8,
		minWidth: 16,
		minHeight: 16
	},
	unreadText:{
		color: 'white',
		fontSize: 12
	},
	vipTabContainer: {
		width: '20%',
		position: 'relative'
	},
	tabText: {
		fontSize: 12
	},
	tabImage: {
		width: 24,
		height: 24,
		resizeMode: 'contain'
	},
	tabImage2: {
		width: 28,
		height: 28,
		resizeMode: 'contain'
	},
	vipButton: {
		position: 'absolute',
		top: isIOS?-32:0,
		justifyContent: 'center',
		alignItems: 'center',
		zIndex: 10,
		backgroundColor: 'transparent'
	},
	vipTab: {
		shadowColor: '#000',
		shadowRadius: 2,
		shadowOpacity: 0.4,
		shadowOffset: {
			width: 0,
			height: 2
		},
		elevation: 8
	},
	vipTabImage: {
		width: 72,
		height: 72,
		borderRadius: 36,
		resizeMode: 'contain'
	},
	vipContainer: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		opacity: 0.9,
		zIndex: 9,
		backgroundColor: 'rgba(0,0,0,0.72)',
	},
	vipMenu: {
		position: 'absolute'
	},
	vipItem: {
		zIndex: 10,
		alignItems: 'center',
		position: 'absolute'
	},
	itemImage: {
		width: 80,
		height: 56,
		resizeMode: 'contain'
	},
	itemBigImage: {
		width: 70,
		height: 56,
		resizeMode: 'contain'
	},
	itemText: {
		color: COLOR_WHITE,
		textAlign: 'center'
	}
});


const MainTabBar = React.memo(({onVip, theme, navigation, route, unread, width}) => {

	const onNavigate = (routeName) => {
		if (route !== routeName) {
			if(route !== 'Home'){
				navigation.replace(routeName);
			} else {
				navigation.navigate(routeName);
			}
		}
	}

	const vipBtnLeft = width/2 - 32;

	return (
			<SafeAreaView style={styles.mainTabContainer}>
				<View style={[styles.vipButton, {left: vipBtnLeft}]}>
					<Button style={styles.vipTab} onPress={onVip} theme={theme}>
						<Image source={images.vip_menu} style={styles.vipTabImage}/>
					</Button>
				</View>
				<LinearGradient style={styles.tabBarContainer} colors={[NAV_BAR_END, NAV_BAR_START]}>
					<TouchableOpacity style={styles.tabContainer} onPress={() => onNavigate('Home')}>
						<Image source={route==='Home'?images.home_icon_en:images.home_icon} style={styles.tabImage}/>
						<Text style={[styles.tabText, {color: themes[theme].menuText}, route==='Home'&&{fontWeight: "bold"}]}>{I18n.t('Home')}</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.tabContainer} onPress={() => onNavigate('Profile')}>
						<Image source={route==='Profile'?images.profile_icon_en:images.profile_icon} style={styles.tabImage}/>
						<Text style={[styles.tabText, {color: themes[theme].menuText}, route==='Profile'&&{fontWeight: "bold"}]}>{I18n.t('Profile')}</Text>
					</TouchableOpacity>
					<View style={styles.vipTabContainer}>
					</View>
					<TouchableOpacity style={styles.tabContainer} onPress={() => onNavigate('Message')}>
						<Image source={route==='Message'?images.message_icon_en:images.message_icon} style={styles.tabImage2}/>
						<Text style={[styles.tabText, {color: themes[theme].menuText}, route==='Message'&&{fontWeight: "bold"}]}>{I18n.t('Messages')}</Text>
						{ unread > 0 && <View style={styles.unread}><Text style={styles.unreadText}>{unread}</Text></View> }
					</TouchableOpacity>
					<TouchableOpacity style={styles.tabContainer} onPress={() => onNavigate('Activity')}>
						<Image source={route==='Activity'?images.activity_icon_en:images.activity_icon} style={styles.tabImage2}/>
						<Text style={[styles.tabText, {color: themes[theme].menuText}, route==='Activity'&&{fontWeight: "bold"}]}>{I18n.t('Activity')}</Text>
					</TouchableOpacity>
				</LinearGradient>
			</SafeAreaView>
		);
})

const VipScreen = React.memo(({onClose, theme, width, navigation}) => {

	const takePhoto = async () => {
		onClose();
		if(await checkCameraPermission()){
			ImagePicker.openCamera(imagePickerConfig).then(image => {
				console.log('image', image);
				navigation.push('CreatePost', {type: POST_TYPE_PHOTO, file_path: image.path});
			});
		}
	}


	const takeVideo = async () => {
		onClose();
		if(await checkCameraPermission()){
			ImagePicker.openCamera(videoPickerConfig).then(video => {
				navigation.push('CreatePost', {type: POST_TYPE_VIDEO, file_path: video.path});
			});
		}
	}


	const choosePhoto = async () => {
		onClose();
		navigation.push('PickLibrary', {type: POST_TYPE_PHOTO});
		// if(await checkPhotosPermission()) {
		// 	ImagePicker.openPicker(imagePickerConfig).then(image => {
		// 		navigation.push('CreatePost', {type: POST_TYPE_PHOTO, file_path: image.path});
		// 	});
		// }
	}

	const chooseVideo = async () => {
		onClose();
		//navigation.push('PickLibrary', {type: POST_TYPE_VIDEO});
		if(await checkPhotosPermission()) {
			ImagePicker.openPicker(libraryVideoPickerConfig).then(video => {
				navigation.push('CreatePost', {type: POST_TYPE_VIDEO, file_path: video.path});
			});
		}
	}

	const itemWidth = 80;
	const radius = 160;
	const baseBottom = 40;
	const middleRadius = Math.round(Math.sqrt(radius * radius / 2));
	const middleWidth = width / 2 - itemWidth / 2;

	return (<>
				<TouchableWithoutFeedback onPress={onClose}>
					<View style={styles.vipContainer}/>
				</TouchableWithoutFeedback>
				<Button style={[styles.vipItem, {left: (middleWidth - radius), bottom: baseBottom}]} onPress={() => takePhoto()} theme={theme}>
					<Image source={images.take_photo} style={styles.itemImage}/>
					<Text style={styles.itemText}>{ I18n.t('Take_photo')}</Text>
				</Button>
				<Button style={[styles.vipItem, {left: (middleWidth - middleRadius), bottom: (baseBottom + middleRadius)}]} onPress={() => takeVideo()} theme={theme}>
					<Image source={images.take_video} style={styles.itemImage}/>
					<Text style={styles.itemText}>{I18n.t('Take_video')}</Text>
				</Button>
				<Button style={[styles.vipItem, {left: middleWidth, bottom: (baseBottom + radius)}]} onPress={() => {onClose(); navigation.push('CreatePost', {type: POST_TYPE_TEXT})}} theme={theme}>
					<Image source={images.text_image} style={styles.itemImage}/>
					<Text style={styles.itemText}>{I18n.t('Text')}</Text>
				</Button>
				<Button style={[styles.vipItem, {left: (middleWidth + middleRadius), bottom: (baseBottom + middleRadius)}]} onPress={() => chooseVideo()} theme={theme}>
					<Image source={images.choose_video} style={styles.itemBigImage}/>
					<Text style={styles.itemText}>{I18n.t('Choose_video')}</Text>
				</Button>
				<Button style={[styles.vipItem, {left: (middleWidth + radius) - 12, bottom: baseBottom}]} onPress={() => choosePhoto()} theme={theme}>
					<Image source={images.choose_image} style={styles.itemBigImage}/>
					<Text style={styles.itemText}>{ I18n.t('Choose_photo') }</Text>
				</Button>
			</>);
});

class MainView extends React.Component{
	static propTypes = {
		testID: PropTypes.string,
		theme: PropTypes.string,
		vertical: PropTypes.bool,
		style: PropTypes.object,
		children: PropTypes.element,
		navigation: PropTypes.object,
		hideNavBorderBar: PropTypes.bool,
		route: PropTypes.string,
		headerLeft: PropTypes.func,
		headerRight: PropTypes.func,
		title: PropTypes.string,
		unread: PropTypes.number
	};

	constructor(props) {
		super(props);
		this.state = {
			showVipScreen: false
		}
	}

	onVip = () => {
		this.setState({showVipScreen: true});
	};

	render () {
		const {showVipScreen} = this.state;
		const {style, children, headerLeft, headerRight, title, theme, width, vertical = true, hasSearch = false, hideNavBorderBar = false, onSearchChangeText, onSearch, navigation, route, unread} = this.props;

		return (
			<View style={[styles.container, style]}>
				{	!hideNavBorderBar &&
					<SafeAreaView style={[styles.navBar, {backgroundColor: themes[theme].headerBackground}]}>
						<LinearGradient style={styles.navBarContainer} colors={[ COLOR_WHITE, HEADER_BAR_START]} angle={90} useAngle>
							<View style={[styles.navBarInnerContainer, {backgroundColor: themes[theme].headerBackground}]}>
								<View style={styles.navBarContent}>
									{headerLeft?headerLeft():<HeaderButton.Back navigation={navigation}/>}
									<View style={styles.pageTitle}><Text style={[styles.pageTitleText, {color: themes[theme].headerTitleColor}]}>{title?title:'マジェル'}</Text></View>
									{headerRight?headerRight():<View style={{width: 64}}/>}
								</View>
								{
									hasSearch &&
									<SearchBox
										onChangeText={onSearchChangeText}
										onSubmitEditing={onSearch}
										testID='federation-view-search'
										placeholder={I18n.t('Search')}
									/>
								}
							</View>
						</LinearGradient>
					</SafeAreaView>
				}
				{children}
				<MainTabBar onVip={this.onVip} theme={theme} navigation={navigation} route={route} unread={unread} width={width}/>
				{
					showVipScreen &&
					<VipScreen theme={theme} width={width} onClose={() => this.setState({showVipScreen: false})}
							   navigation={navigation}/>
				}
			</View>);
	}
}

const mapStateToProps = state => ({
	route: state.app.route,
	unread: state.chat.unread
})

export default connect(mapStateToProps, null)(withDimensions(withTheme(MainView)));
