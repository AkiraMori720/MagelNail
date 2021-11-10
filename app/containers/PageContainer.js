import React from "react";
import {connect} from "react-redux";
import {withDimensions} from "../dimensions";
import {withTheme} from "../theme";
import PropTypes from "prop-types";
import {SafeAreaView, StyleSheet, Text, View} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import {COLOR_WHITE, HEADER_BAR_START, themes} from "../constants/colors";
import SearchBox from "./SearchBox";
import I18n from "../i18n";
import * as HeaderButton from "./HeaderButton";


const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative'
    },
    navBar: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        zIndex: 1
    },
    navBarContainer: {
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        paddingBottom: 4,
    },
    navBarInnerContainer: {
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32
    },
    navBarContent: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 4,
        flex: 1,
        height: 48
    },
    pageTitle: {
        flexGrow: 1
    },
    pageTitleText: {
        textTransform: 'uppercase',
        fontSize: 20,
        textAlign: 'center',
        fontWeight: 'bold'
    }
});

class PageContainer extends React.Component {
    static propTypes = {
        theme: PropTypes.string,
        children: PropTypes.element,
        navigation: PropTypes.object,
        route: PropTypes.string,
        hideNavBorderBar: PropTypes.bool,
        headerLeft: PropTypes.func,
        headerRight: PropTypes.func,
        title: PropTypes.string,
    }

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render () {
        const {style, children, headerLeft, headerRight, title, theme, hasSearch = false, hideNavBorderBar = false, onSearchChangeText, onSearch, navigation, route} = this.props;

        return (
            <View style={[styles.container, style]}>
                {!hideNavBorderBar &&
                <SafeAreaView style={[styles.navBar, {backgroundColor: themes[theme].headerBackground}]}>
                    <LinearGradient style={styles.navBarContainer} colors={[ COLOR_WHITE, HEADER_BAR_START]} angle={90} useAngle>
                        <View style={[styles.navBarInnerContainer, {backgroundColor: themes[theme].headerBackground}]}>
                            <View style={styles.navBarContent}>
                                {headerLeft?headerLeft():<HeaderButton.Back navigation={navigation}/>}
                                <View style={styles.pageTitle}><Text style={[styles.pageTitleText, {color: themes[theme].headerTitleColor}]}>{title?title:'マジェル'}</Text></View>
                                {headerRight?headerRight():<View style={{width: 64}}/>}
                            </View>
                            {
                                hasSearch &&
                                <SearchBox
                                    onChangeText={onSearchChangeText}
                                    onSubmitEditing={onSearch}
                                    testID='federation-view-search'
                                    placeholder={I18n.t('Search')}
                                />
                            }
                        </View>
                    </LinearGradient>
                </SafeAreaView>
                }
                {children}
            </View>
        );
    }
}


const mapStateToProps = state => ({
    route: state.app.route
})

export default connect(mapStateToProps, null)(withDimensions(withTheme(PageContainer)));
