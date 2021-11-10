import React from 'react';
import PropTypes from "prop-types";
import {StyleSheet} from "react-native";
import { WebView } from 'react-native-webview';

import StatusBar from "../../containers/StatusBar";
import {withTheme} from "../../theme";
import {GradientHeader} from '../../containers/GradientHeader';
import MainScreen from '../../containers/MainScreen';
import * as HeaderButton from '../../containers/HeaderButton';

const styles = StyleSheet.create({

})

class ProductWebView extends React.Component{
    static propTypes = {
        theme: PropTypes.string,
    }

    constructor(props) {
        super(props);
        const product = props.route.params?.product;
        this.state = {
            loading: true,
            product,
        };
        this.init(product.id);
    }

    init = async (id) => {
        const {navigation} = this.props;
        navigation.setOptions({
            headerLeft: () => <HeaderButton.Drawer navigation={navigation} testID='nav-drawer' />,
            title: this.state.product.name,
            headerBackground: () => <GradientHeader/>
        })
    }

    render(){
        const {navigation, theme} = this.props;
        return (
            <MainScreen navigation={navigation}>
                <StatusBar/>
                <WebView originWhitelist={['*']} source={{ uri: 'https://www.vipbillionaires.com/product-page-1/crocodile-skin-apple-watch-straps-2' }} />
            </MainScreen>
        )
    }
}

export default withTheme(ProductWebView);
