import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, TouchableOpacity, Image} from 'react-native';

import { withTheme } from '../../theme';
import images from '../../assets/images';

const styles = StyleSheet.create({
	ownerContainer: {
		flexDirection: 'row',
		marginBottom: 2
	},
	username: {
		maxWidth: 200,
		fontSize: 12,
		fontWeight: '300',
		lineHeight: 16
	},
	avatar: {
		width: 32,
		height: 32,
		borderRadius: 16,
		borderWidth: StyleSheet.hairlineWidth,
		borderColor: 'grey'
	}
});

const User = React.memo(({
	owner, isOwn, theme, ...props
}) => (
		<TouchableOpacity style={styles.ownerContainer}>
			<Image source={owner.avatar?{uri: owner.avatar}:images.default_avatar} style={styles.avatar}/>
		</TouchableOpacity>)
);

User.propTypes = {
	owner: PropTypes.object,
	theme: PropTypes.string
};
User.displayName = 'MessageUser';

export default withTheme(User);
