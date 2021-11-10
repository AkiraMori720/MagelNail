import React from 'react';
import PropTypes from 'prop-types';

import { isIOS } from '../../utils/deviceInfo';
import I18n from '../../i18n';
import Container from './HeaderButtonContainer';
import Item from './HeaderButtonItem';

// Left
export const Drawer = React.memo(({ navigation, testID, ...props }) => (
	<Container left>
		<Item iconName='menu' vector={'MaterialCommunityIcons'} onPress={navigation.toggleDrawer} testID={testID} {...props} />
	</Container>
));

export const CloseButtonGoTop = React.memo(({ navigation, testID }) => (
	<Container left>
		<Item title='close' iconName='close' onPress={() => navigation.pop()} testID={testID} />
	</Container>
));

export const CloseGoSignIn = React.memo(({ navigation, testID }) => (
	<Container left>
		<Item title='close' iconName='close' onPress={() => navigation.replace('LoginView')} testID={testID} />
	</Container>
));

export const CloseModal = React.memo(({
	navigation, testID, onPress = () => navigation.pop(), ...props
}) => (
	<Container left>
		<Item iconName='close' onPress={onPress} testID={testID} {...props} />
	</Container>
));

export const CancelModal = React.memo(({ onPress, testID }) => (
	<Container left>
		{isIOS
			? <Item title={I18n.t('Cancel')} onPress={onPress} testID={testID} />
			: <Item iconName='close' onPress={onPress} testID={testID} />
		}
	</Container>
));

// Right
export const More = React.memo(({ onPress, testID }) => (
	<Container>
		<Item iconName='more-vert' vector='MaterialIcons' size={24} onPress={onPress} testID={testID} />
	</Container>
));

export const Contact = React.memo(({navigation, testID, ...props }) => (
	<Container>
		<Item iconName='edit' vector='Feather' size={20} onPress={() => navigation.push('Contact')} testID={testID} {...props} />
	</Container>
));

export const Save = React.memo(({ onPress, testID, ...props }) => (
	<Container>
		<Item title={I18n.t("Save")} onPress={onPress} testID={testID} {...props} />
	</Container>
));

export const Complete = React.memo(({ onPress, testID, ...props }) => (
	<Container>
		<Item title={I18n.t("Complete")} onPress={onPress} testID={testID} {...props} />
	</Container>
));

export const Publish = React.memo(({ onPress, testID, ...props }) => (
	<Container>
		<Item title={I18n.t("Publish")} onPress={onPress} testID={testID} {...props} />
	</Container>
));

export const Next = React.memo(({ onPress, testID, ...props }) => (
	<Container>
		<Item title={I18n.t("Next")} onPress={onPress} testID={testID} {...props} />
	</Container>
));

export const Report = React.memo(({ onPress, testID, ...props }) => (
	<Container>
		<Item iconName='flag' vector='MaterialIcons' size={20} onPress={onPress} testID={testID} {...props} />
	</Container>
));

export const Search = React.memo(({ navigation, testID, ...props }) => (
	<Container>
		<Item iconName='search' vector='Ionicons' size={24} onPress={() => navigation.push('Friend')} testID={testID} {...props} />
	</Container>
));

export const Back = React.memo(({ navigation, testID, ...props }) => (
	<Container>
		<Item iconName='chevron-back-outline' label={I18n.t('Back')} vector='Ionicons' size={24} onPress={() => navigation.pop()} testID={testID} {...props} />
	</Container>
));

export const Cart = React.memo(({ navigation, testID, ...props }) => (
	<Container>
		<Item iconName='cart' vector='Ionicons' size={24} onPress={() => navigation.replace('CheckOut')} testID={testID} {...props} />
	</Container>
));

Drawer.propTypes = {
	navigation: PropTypes.object.isRequired,
	testID: PropTypes.string.isRequired
};
CloseButtonGoTop.propTypes = {
	navigation: PropTypes.object.isRequired,
	testID: PropTypes.string.isRequired,
};
CloseGoSignIn.propTypes = {
	navigation: PropTypes.object.isRequired,
	testID: PropTypes.string.isRequired,
};
CloseModal.propTypes = {
	navigation: PropTypes.object.isRequired,
	testID: PropTypes.string.isRequired,
	onPress: PropTypes.func
};
CancelModal.propTypes = {
	onPress: PropTypes.func.isRequired,
	testID: PropTypes.string.isRequired
};
More.propTypes = {
	onPress: PropTypes.func.isRequired,
	testID: PropTypes.string.isRequired
};
Contact.propTypes = {
	onPress: PropTypes.func.isRequired,
	testID: PropTypes.string.isRequired
};
Save.propTypes = {
	onPress: PropTypes.func.isRequired,
	testID: PropTypes.string.isRequired
};
Complete.propTypes = {
	onPress: PropTypes.func.isRequired,
	testID: PropTypes.string.isRequired
};
Publish.propTypes = {
	onPress: PropTypes.func.isRequired,
	testID: PropTypes.string.isRequired
};
Next.propTypes = {
	onPress: PropTypes.func.isRequired,
	testID: PropTypes.string.isRequired
};
Search.propTypes = {
	onPress: PropTypes.func.isRequired,
	testID: PropTypes.string.isRequired
};
Back.propTypes = {
	onPress: PropTypes.func.isRequired,
	testID: PropTypes.string.isRequired
};
