import React from 'react';
import PropTypes from "prop-types";
import StatusBar from "../../containers/StatusBar";
import {withTheme} from "../../theme";
import {FlatList, Text, TouchableOpacity, View} from 'react-native';
import styles from "./styles";
import {VectorIcon} from "../../containers/VectorIcon";
import * as HeaderButton from '../../containers/HeaderButton';
import MainScreen from '../../containers/MainScreen';
import I18n from '../../i18n';
import {getStatusBarHeight} from "../../utils/statusbar";

class SettingView extends React.Component{
    static propTypes = {
        navigation: PropTypes.object,
        theme: PropTypes.string,
    }

    constructor(props) {
        super(props);
        this.state = {

        }

        this.menus = [
            { id: 'profile', title: I18n.t('Profile'), type: 'title' },
            { id: 'security_settings', title: I18n.t('Security_setting'), type: 'view' },
            // { id: 'credit_card', title: I18n.t('Credit_card'), type: 'view' },
            { id: 'blocked', title: I18n.t('Blocked'), type: 'title' },
            // { id: 'term_and_conditions', title: I18n.t('Terms_of_use'), type: 'view' },
            // { id: 'privacy_policy_view', title: I18n.t('Privacy_policy'),  type: 'view' },
            { id: 'blocked_view', title: I18n.t('Blocked'),  type: 'view' }
        ]
    }

    onPressItem = (menu_id) => {
        const {navigation} = this.props;

        switch (menu_id){
            case 'security_settings':
                navigation.navigate('Security');
                break;
            // case 'credit_card':
            //     navigation.navigate('CreditCard');
            //     break;
            // case 'term_and_conditions':
            //     navigation.navigate('About', {type: 0});
            //     break;
            // case 'privacy_policy_view':
            //     navigation.navigate('About', {type: 1});
            //     break;
            case 'blocked_view':
                navigation.navigate('Block');
                break;
        }
    }

    renderItem = ({item}) => {
        const { theme } = this.props;
        if(item.type === 'title'){
            return (
                <View style={styles.itemContainer}>
                    <Text style={styles.titleText}>{item.title}</Text>
                </View>
            )
        }
        return (
            <TouchableOpacity onPress={() => this.onPressItem(item.id)} style={styles.itemContainer}>
                <Text style={styles.itemText}>{item.title}</Text>
                {item.type === 'view' && <VectorIcon type={'Ionicons'} name={'md-chevron-forward'} size={20} color={'grey'}/>}
            </TouchableOpacity>
        )
    }

    render(){
        const {navigation, theme} = this.props;
        return (
            <MainScreen
                navigation={navigation}
                headerLeft={() => <HeaderButton.Drawer navigation={navigation} testID='nav-drawer' />}
                title={I18n.t('Settings')}
            >
                <StatusBar/>
                <FlatList
                    style={{marginTop: 52 + getStatusBarHeight(true)}}
                    data={this.menus}
                    renderItem={this.renderItem}
                    keyExtractor={item => item.id}
                />
            </MainScreen>
        )
    }
}

export default withTheme(SettingView);
