import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import PropTypes from 'prop-types';
import styles from './styles';
import images from '../../assets/images';
import {themes} from '../../constants/colors';
import {withTheme} from '../../theme';

const Content = React.memo(({msg, photo, isOwn, onPressMedia, theme}) => {
	if(photo){
		return (
			<TouchableOpacity onPress={onPressMedia} style={[styles.photoInnerContent, isOwn?{alignItems: 'flex-end'}:{alignItems: 'flex-start'}]}>
				<Image
					source={images.chat_background_regular}
					style={[
						isOwn?styles.contentBackground:styles.contentOtherBackground,
						isOwn?
							{tintColor: themes[theme].messageOwnBackground}
							:
							{tintColor:themes[theme].messageOtherBackground}
					]}/>
				<View
					style={[isOwn?styles.imageMsg: styles.imageOtherMsg,
						isOwn?{backgroundColor: themes[theme].messageOwnBackground}
							:
							{backgroundColor: themes[theme].messageOtherBackground}
					]}
				>
					<Image
						source={{uri: photo}}
						resizeMode={'contain'}
						style={styles.photoMessage}/>
				</View>
			</TouchableOpacity>
		)
	}
	return (
		<View style={[styles.messageInnerContent, isOwn?{alignItems: 'flex-end'}:{alignItems: 'flex-start'}]}>
			<Image
				source={images.chat_background_regular}
			   style={[
				   isOwn?styles.contentBackground:styles.contentOtherBackground,
				   	isOwn?
						{tintColor: themes[theme].messageOwnBackground}
						:
						{tintColor:themes[theme].messageOtherBackground}
			   ]}/>
			<Text
				style={[isOwn?styles.messageOwnText:styles.messageOtherText,
						isOwn?{color: themes[theme].ownMsgText, backgroundColor: themes[theme].messageOwnBackground}
							:
						{color: themes[theme].otherMsgText, backgroundColor: themes[theme].messageOtherBackground}
					]}
			>{msg}</Text>
		</View>
	);
});

Content.propTypes = {
	photo: PropTypes.string,
	isOwn: PropTypes.bool,
	msg: PropTypes.string,
	onPressMedia: PropTypes.func,
	theme: PropTypes.string,
};
Content.displayName = 'MessageContent';

export default withTheme(Content);
