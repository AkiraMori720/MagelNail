import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { ThemeContext } from '../theme';
import {
	outsideHeader, themedHeader, StackAnimation
} from '../utils/navigation';
import {createDrawerNavigator} from "@react-navigation/drawer";

import SidebarView from "../views/SidebarView";
import HomeView from "../views/HomeView";
import PostsView from "../views/HomeView/posts";
import RecentView from "../views/HomeView/recent";
import PopularView from "../views/HomeView/popular";
import ProfileView from '../views/ProfileView';
import ProfileEditView from '../views/ProfileEditView';
import FriendView from '../views/FriendView';
import FollowView from '../views/FollowView';
import CreatePostView from '../views/CreatePostView';
import PostDetailView from '../views/PostDetailView';
import MessageView from '../views/MessageView';
import ChatView from '../views/ChatView';
import SettingView from '../views/SettingView';
import AboutView from '../views/AboutView';
import SecurityView from '../views/SecurityView';
import BlockView from '../views/BlockView';
import OtherProfileView from '../views/OtherProfileView';
import ActivityView from '../views/ActivityView';
import ShopView from '../views/ShopView';
import CategoryView from '../views/CategoryView';
import AboutUsView from '../views/AboutUsView';
import ProductDetailView from '../views/ProductDetailView';
import CheckOutView from '../views/CheckOutView';
import ShippingView from '../views/ShippingView';
import CreditPayView from '../views/CreditPayView';
import EditPostView from '../views/EditPostView';
import CreditCardView from '../views/CreditCardView';
import ProductWebView from '../views/ProductWebView';
import PickLibraryView from '../views/PickLibraryView';

// Outside
const Inside = createStackNavigator();
const InsideStack = () => {
	const { theme } = React.useContext(ThemeContext);

	return (
		<Inside.Navigator screenOptions={{ ...outsideHeader, ...themedHeader(theme), ...StackAnimation }}>
			<Inside.Screen
				name='Home'
				component={HomeView}
				options={{headerShown: false}}
			/>
			<Inside.Screen
				name='Posts'
				component={PostsView}
				options={{headerShown: false}}
			/>
			<Inside.Screen
				name='Recent'
				component={RecentView}
				options={{headerShown: false}}
			/>
			<Inside.Screen
				name='Popular'
				component={PopularView}
				options={{headerShown: false}}
			/>
			<Inside.Screen
				name='Profile'
				component={ProfileView}
				options={{headerShown: false}}
			/>
			<Inside.Screen
				name='Activity'
				component={ActivityView}
				options={{headerShown: false}}
			/>
			<Inside.Screen
				name='ProfileEdit'
				component={ProfileEditView}
				options={{headerShown: false}}
			/>
			<Inside.Screen
				name='Friend'
				component={FriendView}
				options={{headerShown: false}}
			/>
			<Inside.Screen
				name='OtherProfile'
				component={OtherProfileView}
				options={{headerShown: false}}
			/>
			<Inside.Screen
				name='Follow'
				component={FollowView}
				options={{headerShown: false}}
			/>
			<Inside.Screen
				name='CreatePost'
				component={CreatePostView}
				options={{headerShown: false}}
			/>
			<Inside.Screen
				name='EditPost'
				component={EditPostView}
				options={{headerShown: false}}
			/>
			<Inside.Screen
				name='PostDetail'
				component={PostDetailView}
				options={{headerShown: false}}
			/>
			<Inside.Screen
				name='Message'
				component={MessageView}
				options={{headerShown: false}}
			/>
			<Inside.Screen
				name='Chat'
				component={ChatView}
				options={{headerShown: false}}
			/>
			<Inside.Screen
				name='Setting'
				component={SettingView}
				options={{headerShown: false}}
			/>
			<Inside.Screen
				name='AboutUs'
				component={AboutUsView}
				options={{headerShown: false}}
			/>
			<Inside.Screen
				name='About'
				component={AboutView}
				options={{headerShown: false}}
			/>
			<Inside.Screen
				name='Security'
				component={SecurityView}
				options={{headerShown: false}}
			/>
			<Inside.Screen
				name='Block'
				component={BlockView}
				options={{headerShown: false}}
			/>
			<Inside.Screen
				name='Shop'
				component={ShopView}
				options={{headerShown: false}}
			/>
			<Inside.Screen
				name='ProductWeb'
				component={ProductWebView}
				options={{headerShown: false}}
			/>
			<Inside.Screen
				name='Category'
				component={CategoryView}
				options={{headerShown: false}}
			/>
			<Inside.Screen
				name='CreditPay'
				component={CreditPayView}
				options={{headerShown: false}}
			/>
			<Inside.Screen
				name='ProductDetail'
				component={ProductDetailView}
				options={{headerShown: false}}
			/>
			<Inside.Screen
				name='CheckOut'
				component={CheckOutView}
				options={{headerShown: false}}
			/>
			<Inside.Screen
				name='Shipping'
				component={ShippingView}
				options={{headerShown: false}}
			/>
			<Inside.Screen
				name='CreditCard'
				component={CreditCardView}
				options={{headerShown: false}}
			/>
			<Inside.Screen
				name='PickLibrary'
				component={PickLibraryView}
				options={{headerShown: false}}
			/>
		</Inside.Navigator>
	);
};

const Drawer = createDrawerNavigator();
const DrawerNavigator = () => (
	<Drawer.Navigator
		drawerContent={({ navigation, state }) => <SidebarView navigation={navigation} state={state} />}
		screenOptions={{ swipeEnabled: true }}
		drawerType='back'
	>
		<Drawer.Screen name='InsideStack' component={InsideStack} options={{headerShown: false}}/>
	</Drawer.Navigator>
)

export default DrawerNavigator;
