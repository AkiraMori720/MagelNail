import React from 'react';
import PropTypes from "prop-types";
import {StyleSheet} from "react-native";
import { WebView } from 'react-native-webview';

import StatusBar from "../containers/StatusBar";
import {withTheme} from "../theme";
import {
    CONTENT_PRIVACY_POLICY,
    CONTENT_TERMS_AND_CONDITIONS,
    CONTENT_USER_AGREEMENT, CONTENT_USER_AGREEMENT_JP,
} from '../constants/app';
import {GradientHeader} from '../containers/GradientHeader';
import I18n from '../i18n';
import PageContainer from "../containers/PageContainer";
import {getStatusBarHeight} from "../utils/statusbar";

const styles = StyleSheet.create({

})

class AboutView extends React.Component{
    static propTypes = {
        theme: PropTypes.string,
    }

    constructor(props) {
        super(props);
        const param_type = this.props.route.params?.type;
        let title = '';
        let content = '';
        if(param_type !== null){
            switch (param_type) {
                case 0:
                    title = I18n.t('Terms_of_use');
                    content = `<html><head><meta name="viewport" content="width=device-width, initial-scale=0.8"><style>body{padding: 8px; line-height: 1.4rem}</style></head><body>${CONTENT_TERMS_AND_CONDITIONS}</body></html>`;
                    break;
                case 1:
                    title = I18n.t('Privacy_policy');
                    content = `<html><head><meta name="viewport" content="width=device-width, initial-scale=0.8"><style>body{padding: 8px; line-height: 1.4rem}</style></head><body>${CONTENT_PRIVACY_POLICY}</body></html>`;
                    break;
                case 2:
                    title = I18n.t('User_agreement');
                    content = `<html><head><meta name="viewport" content="width=device-width, initial-scale=0.8"><style>body{padding: 8px; line-height: 1.4rem}</style></head><body>${I18n.locale === 'ja'?CONTENT_USER_AGREEMENT_JP:CONTENT_USER_AGREEMENT}</body></html>`;
            }
        }
        this.state = {
            type: param_type??0,    // 0: about, 1: privacy, 2: terms
            title: title,
            content: content
        }
        this.init();
    }

    init = () => {
        const {navigation} = this.props;
        navigation.setOptions({
            title: this.state.title,
            headerBackground: () => <GradientHeader/>
        });
    }



    render(){
        const {navigation, theme} = this.props;
        const {title, content} = this.state;
        return (
            <PageContainer
                navigation={navigation}
                title={title}
                >
                <StatusBar/>
                <WebView originWhitelist={['*']} source={{ html: content, baseUrl: '' }} style={{marginTop: 50 + getStatusBarHeight(true)}}/>
            </PageContainer>
        )
    }
}

export default withTheme(AboutView);
