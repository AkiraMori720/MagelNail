import React from 'react';
import PropTypes from "prop-types";
import StatusBar from "../../containers/StatusBar";
import {withTheme} from "../../theme";
import {Image, SafeAreaView, Text, View} from 'react-native';
import styles from "./styles";
import images from "../../assets/images";
import {COLOR_WHITE, HEADER_BAR_START, NAV_BAR_END, NAV_BAR_START, themes} from '../../constants/colors';
import I18n from '../../i18n';
import sharedStyles from "../Styles";
import LinearGradient from "react-native-linear-gradient";
import * as HeaderButton from "../../containers/HeaderButton";

class AboutUsView extends React.Component {
    static propTypes = {
        theme: PropTypes.string,
    }

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    componentDidMount() {
    }

    render() {
        const {theme, navigation} = this.props;

        return (
            <View style={[sharedStyles.container, {backgroundColor: themes[theme].backgroundColor}]}>
                <StatusBar backgroundColor={'white'}/>
                <SafeAreaView style={styles.navBarContent}>
                    <HeaderButton.Drawer navigation={navigation} testID='nav-drawer' />
                    <View style={styles.pageTitle}><Text style={[styles.pageTitleText, {color: themes[theme].headerTitleColor}]}>{I18n.t('About_us')}</Text></View>
                    <View style={{width: 64}}/>
                </SafeAreaView>
                <View style={[styles.mainContainer, {backgroundColor: themes[theme].backgroundColor}]}>
                    <Image style={styles.bottomImage} source={images.about_us_bottom} resizeMode={'stretch'}/>
                </View>
            </View>
        )
    }
}

export default withTheme(AboutUsView);
