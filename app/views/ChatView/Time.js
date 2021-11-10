import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, View, Text} from 'react-native';

import { withTheme } from '../../theme';
import {date_str_format} from '../../utils/datetime';
import moment from 'moment';

const styles = StyleSheet.create({
	timeContainer: {
		justifyContent: 'flex-end'
	},
	timeText: {
		fontSize: 12
	}
});

const Time = React.memo(({
	owner, isOwn, theme, createdAt, ...props
}) => (
		<View style={styles.timeContainer}>
			<Text style={styles.timeText}>{moment(createdAt).format('LT')}</Text>
		</View>)
);

Time.propTypes = {
	owner: PropTypes.object,
	theme: PropTypes.string
};
Time.displayName = 'MessageTime';

export default withTheme(Time);
