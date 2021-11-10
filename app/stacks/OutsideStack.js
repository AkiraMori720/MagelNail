import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { ThemeContext } from '../theme';
import {
	outsideHeader, themedHeader, StackAnimation
} from '../utils/navigation';

import SignInView from '../views/SignInView';
import SignUpView from '../views/SignUpView';
import OnBoardingView from '../views/OnBoardingView';
import AboutView from '../views/AboutView';

// Outside
const Outside = createStackNavigator();
const OutsideStack = () => {
	const { theme } = React.useContext(ThemeContext);

	return (
		<Outside.Navigator screenOptions={{ ...outsideHeader, ...themedHeader(theme), ...StackAnimation }}>
			<Outside.Screen
				name='OnBoard'
				component={OnBoardingView}
				options={{headerShown: false}}
			/>
			<Outside.Screen
				name='SignIn'
				component={SignInView}
				options={{headerShown: false}}
			/>
			<Outside.Screen
				name='SignUp'
				component={SignUpView}
				options={{headerShown: false}}
			/>
			<Outside.Screen
				name='About'
				component={AboutView}
				options={{headerShown: false}}
			/>
		</Outside.Navigator>
	);
};

export default OutsideStack;
