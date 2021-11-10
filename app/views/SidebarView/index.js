import React from 'react';
import PropTypes from "prop-types";
import {Image, ScrollView, Text, TouchableOpacity, View, Linking} from 'react-native';
import {connect} from "react-redux";

import {
    COLOR_WHITE,
    HEADER_BACKGROUND,
    HEADER_BAR_START,
    NAV_BAR_END,
    NAV_BAR_START,
    themes,
} from '../../constants/colors';
import StatusBar from "../../containers/StatusBar";
import {withTheme} from "../../theme";
import styles from "./styles";
import images from "../../assets/images";
import SidebarItem from "./SidebarItem";
import scrollPersistTaps from "../../utils/scrollPersistTaps";
import {logout as logoutAction} from "../../actions/login";
import {showConfirmationAlert} from "../../lib/info";
import LinearGradient from 'react-native-linear-gradient';
import Navigation from '../../lib/Navigation';
import I18n from '../../i18n';
import {SITE_SHOP_URL} from "../../constants/app";
import firebaseSdk from "../../lib/firebaseSdk";

class SidebarView extends React.Component{
    static propTypes = {
        logout: PropTypes.func,
        user: PropTypes.object,
        theme: PropTypes.string,
    }

    constructor(props) {
        super(props);
        this.state = {

        }

        this.menus = [
            {
                id: 'feed',
                name: I18n.t('Feed'),
                icon: images.menu_feed,
                route: 'Home',
                routes: ['Home']
            },
            {
                id: 'open_post',
                name: I18n.t('Open_posts'),
                icon: images.menu_open_post,
                route: 'Posts',
                routes: ['Posts']
            },
            {
                id: 'about_us',
                name: I18n.t('About_us'),
                icon: images.menu_about_us,
                route: 'AboutUs',
                routes: ['AboutUs']
            },
            {
                id: 'shop',
                name: I18n.t('Shop'),
                icon: images.menu_shop,
                route: 'Shop',
                routes: ['Shop']
            },
            {
                id: 'setting',
                name: I18n.t('Settings'),
                icon: images.menu_settings,
                route: 'Setting',
                routes: ['Setting']
            },
            {
                id: 'privacy_policy',
                name: I18n.t('Privacy_policy'),
                icon: images.menu_privacy,
                route: 'Privacy',
                routes: ['Privacy']
            },
            {
                id: 'terms_of_use',
                name: I18n.t('Terms_of_use'),
                icon: images.menu_terms,
                route: 'Terms',
                routes: ['Terms']
            },
        ]
    }

    onClick = (item) => {
        const {navigation} = this.props;
        switch (item.id){
            case 'terms_of_use':
                return this.onNavigate('About', {type: 0});
            case 'privacy_policy':
                return this.onNavigate('About', {type: 1});
            case 'eula':
                return this.onNavigate('About', {type: 2});
            case 'shop':
                return Linking.openURL(SITE_SHOP_URL);
            default:
                this.onNavigate(item.route);
        }
    };

    onNavigate = (routeName, params) => {
        const {navigation} = this.props;
        const route = Navigation.getCurrentRoute();
        if(route !== routeName){
            if(route !== 'Home'){
                navigation.popToTop();
                navigation.navigate(routeName, params);
            } else {
                navigation.navigate(routeName, params);
            }
        }
    }

    onLogOut = () => {
        const {logout} = this.props;
        showConfirmationAlert({
            title: I18n.t('Logout'),
            message: I18n.t('are_you_sure_to_log_out'),
            callToAction: I18n.t('Confirm'),
            onPress: () => {
                firebaseSdk.unSubscribe();
                logout();
            }
        });
    }

    render(){
        const {user, theme} = this.props;
        const routeName = Navigation.getCurrentRoute();

        return (
            <View style={{ flex:1, backgroundColor: themes[theme].backgroundColor }}>
                <StatusBar/>
                <View style={{ backgroundColor: HEADER_BACKGROUND }}>
                    <LinearGradient style={styles.profileContainer} colors={[HEADER_BAR_START, COLOR_WHITE]} angle={90} useAngle>
                        <View style={[styles.profileInnerContainer, {backgroundColor: themes[theme].headerBackground}]}>
                            <Image source={user.avatar?{uri: user.avatar}:images.default_avatar} style={styles.avatar}/>
                            <Text style={[styles.profileName, {color: themes[theme].sideTitleText}]}>{user.displayName}</Text>
                        </View>
                    </LinearGradient>
                </View>
                <ScrollView style={{flexGrow: 1, backgroundColor: HEADER_BACKGROUND}} {...scrollPersistTaps}>
                    <LinearGradient style={styles.logoContainer} colors={[HEADER_BAR_START, COLOR_WHITE]} angle={90} useAngle>
                        <LinearGradient style={styles.logoInnerContainer} colors={[NAV_BAR_END, NAV_BAR_START]}>
                            <View style={styles.headerContainer}>
                                <Image source={images.logo} style={styles.logo}/>
                            </View>
                            {
                                this.menus.map(m => (
                                    <SidebarItem
                                        id={`sidebar-view-key-${m.id}`}
                                        text={m.name}
                                        textStyle={{color: themes[theme].titleText}}
                                        left={(
                                            <Image
                                                source={m.icon}
                                                style={styles.menuIcon}
                                            />
                                        )}
                                        onPress={() => this.onClick(m)}
                                        current={m.routes.includes(routeName)}
                                    />
                                ))
                            }
                        </LinearGradient>
                    </LinearGradient>
                </ScrollView>
                <View style={{ backgroundColor: HEADER_BACKGROUND }}>
                    <LinearGradient style={styles.logoutContainer} colors={[COLOR_WHITE, HEADER_BAR_START]} angle={90} useAngle>
                        <LinearGradient style={styles.logoutInnerContainer} colors={[NAV_BAR_END, NAV_BAR_START]} angle={90} useAngle>
                            <TouchableOpacity onPress={this.onLogOut} style={styles.logoutMenu}>
                                <Image source={images.ic_menu_logout} style={styles.logoutIcon}/>
                                <Text style={[styles.logoutText, {color: themes[theme].infoText}]}>{I18n.t('Logout')}</Text>
                            </TouchableOpacity>
                        </LinearGradient>
                    </LinearGradient>
                </View>
            </View>
        )
    }
}

const mapStateToProps = state => ({
    user: state.login.user
})

const mapDispatchToProps = dispatch => ({
    logout: params => dispatch(logoutAction(params))
})

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(SidebarView));
