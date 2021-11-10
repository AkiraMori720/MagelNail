import React from 'react';
import {View, StyleSheet, TextInput} from 'react-native';
import PropTypes from 'prop-types';

import sharedStyles from '../views/Styles';
import { withTheme } from '../theme';
import {COLOR_BLACK, themes} from '../constants/colors';
import {VectorIcon} from "./VectorIcon";

const styles = StyleSheet.create({
	container: {
		borderBottomLeftRadius: 32,
		borderBottomRightRadius: 32
	},
	searchBox: {
		alignItems: 'center',
		borderRadius: 24,
		flexDirection: 'row',
		fontSize: 17,
		paddingHorizontal: 10,
		backgroundColor: 'white',
		marginVertical: 4,
		marginHorizontal: 8
	},
	input: {
		height: 40,
		flex: 1,
		fontSize: 17,
		marginLeft: 8,
		paddingTop: 0,
		paddingBottom: 0,
		...sharedStyles.textRegular,
		color: COLOR_BLACK
	},
	cancel: {
		padding: 4
	},
	cancelText: {
		...sharedStyles.textRegular,
		fontSize: 17
	}
});

const SearchBox = ({
	onChangeText, onSubmitEditing, testID, hasCancel, onCancelPress, inputRef, placeholder, theme, ...props
}) => (
	<View
		style={[
			styles.container,
			{ backgroundColor: themes[theme].headerSecondaryBackground }
		]}
	>
		<View style={[styles.searchBox]}>
			<VectorIcon name='search' type='Ionicons' size={18} color={themes[theme].auxiliaryText} />
			<TextInput
				ref={inputRef}
				autoCapitalize='none'
				autoCorrect={false}
				blurOnSubmit
				clearButtonMode='while-editing'
				placeholder={ placeholder??'Search' }
				returnKeyType='search'
				style={styles.input}
				testID={testID}
				underlineColorAndroid='transparent'
				onChangeText={onChangeText}
				onSubmitEditing={onSubmitEditing}
				placeholderTextColor={themes[theme].auxiliaryText}
				theme={theme}
				{...props}
			/>
		</View>
	</View>
);

SearchBox.propTypes = {
	onChangeText: PropTypes.func.isRequired,
	onSubmitEditing: PropTypes.func,
	hasCancel: PropTypes.bool,
	onCancelPress: PropTypes.func,
	theme: PropTypes.string,
	inputRef: PropTypes.func,
	testID: PropTypes.string,
	placeholder: PropTypes.string
};

export default withTheme(SearchBox);
