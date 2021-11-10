import React from 'react';
import {Dimensions} from 'react-native';
import {Provider} from 'react-redux';
import {SafeAreaProvider, initialWindowMetrics} from 'react-native-safe-area-context';

import {
    defaultTheme,
    subscribeTheme
} from './utils/theme';
import store from './lib/createStore';
import {ThemeContext} from './theme';
import {DimensionsContext} from './dimensions';

import {ActionSheetProvider} from './containers/ActionSheet';
import AppContainer from './AppContainer';
import InAppNotification from './containers/InAppNotification';
import Toast from './containers/Toast';
import debounce from "./utils/debounce";
import AsyncStorage from "@react-native-community/async-storage";
import {APP_THEME} from "./constants/keys";
import {StripeProvider} from '@stripe/stripe-react-native';
import {MERCHANT_ID, STRIPE_PUBLISHABLE_KEY} from './constants/app';

export default class Root extends React.Component {
    constructor(props) {
        super(props);

        this.init();
        const {
            width, height, scale, fontScale
        } = Dimensions.get('window');

        this.state = {
            theme: defaultTheme(),
            width,
            height,
            scale,
            fontScale
        };
    }

    componentDidMount() {
        Dimensions.addEventListener('change', this.onDimensionsChange);
    }

    componentWillUnmount() {
        Dimensions.removeEventListener('change', this.onDimensionsChange);

    }

    init = async () => {
        const theme = await AsyncStorage.getItem(APP_THEME);
        if(theme){
            this.setTheme(theme);
        }
    }

    onDimensionsChange = debounce(({
                                       window: {
                                           width, height, scale, fontScale
                                       }
                                   }) => {
        this.setDimensions({
            width, height, scale, fontScale
        });
        // this.setMasterDetail(width);
    })

    setTheme = (newTheme = {}) => {
        // change theme state
        this.setState({theme: newTheme}, () => {
            const {theme} = this.state;
            // subscribe to Appearance changes
            subscribeTheme(theme);
        });
    }

    setDimensions = ({
                         width, height, scale, fontScale
                     }) => {
        this.setState({
            width, height, scale, fontScale
        });
    }

    render() {
        const {
            theme, width, height, scale, fontScale
        } = this.state;

        return (
            <SafeAreaProvider initialMetrics={initialWindowMetrics}>
                <Provider store={store}>
                    <ThemeContext.Provider
                        value={{
                            theme,
                            setTheme: this.setTheme
                        }}
                    >
                        <DimensionsContext.Provider
                            value={{
                                width,
                                height,
                                scale,
                                fontScale,
                                setDimensions: this.setDimensions
                            }}
                        >
                            <StripeProvider
                                publishableKey={STRIPE_PUBLISHABLE_KEY}
                                merchantIdentifier={MERCHANT_ID}
                            >
                                <ActionSheetProvider>
                                    <AppContainer/>
                                    <InAppNotification/>
                                    <Toast/>
                                </ActionSheetProvider>
                            </StripeProvider>
                        </DimensionsContext.Provider>
                    </ThemeContext.Provider>
                </Provider>
            </SafeAreaProvider>
        )
    }
}
