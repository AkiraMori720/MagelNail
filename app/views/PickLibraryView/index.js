import React from 'react';
import PropTypes from 'prop-types';
import {FlatList, Image, Text, TouchableOpacity, View} from 'react-native';
import {connect} from "react-redux";

import {withTheme} from "../../theme";
import StatusBar from "../../containers/StatusBar";
import styles from "./styles";
import {setUser as setUserAction} from "../../actions/login";
import * as HeaderButton from '../../containers/HeaderButton';
import ActivityIndicator from '../../containers/ActivityIndicator';
import {POST_TYPE_PHOTO, POST_TYPE_VIDEO} from '../../constants/app';
import I18n from '../../i18n';
import CameraRoll from '@react-native-community/cameraroll';
import Swiper from 'react-native-swiper';
import PageContainer from "../../containers/PageContainer";
import {getStatusBarHeight} from "../../utils/statusbar";

class PickLibraryView extends React.Component{
    static propTypes = {
        navigation: PropTypes.object,
        user: PropTypes.object,
        setUser: PropTypes.func,
        theme: PropTypes.string
    }

    constructor(props) {
        super(props);
        const type = props.route.params?.type??POST_TYPE_PHOTO;
        this.mounted = false;
        this.state = {
            type,
            select_image_index: null,
            playing: false,
            text: '',
            isLoading: true,
            data: [],
            showGallery: false,
            currentSideIndex: null
        }
        this.init();
    }

    componentDidMount() {
        this.mounted = true;
    }

    setSafeState(states){
        if(this.mounted){
            this.setState(states);
        } else {
            this.state = {...this.state, ...states};
        }
    }

    init = async () => {
        const {type} = this.state;

        CameraRoll.getPhotos({
            first: 50,
            assetType: type===POST_TYPE_VIDEO?'Videos':'Photos',
        })
            .then(res => {
                const images = res.edges.map((e) => ({uri: e.node.image.uri}));
                this.setSafeState({ data: images, isLoading: false, select_image_index: images.length?0:null});
                console.log('res', res, this.state.data, this.state.select_image_index);
            })
            .catch((error) => {
                this.setSafeState({isLoading: false});
                console.log(error);
            });
    }

    onNext = () => {
        const { data, select_image_index, type } = this.state;
        const {navigation} = this.props;
        if(select_image_index !== null){
            navigation.push('CreatePost', {type: type, file_path: data[select_image_index].uri});
        }
    }

    renderSlides = () => {
        let sides = [];
        const {data} = this.state;
        data.forEach((item, index) => {
            sides.push(<TouchableOpacity activeOpacity={1} style={styles.slide} key={index} onPress={() => this.setState({showGallery: false})}>
                <Image source={{uri: item.uri}} style={styles.slideImage} resizeMode={'contain'}/>
            </TouchableOpacity>);
        })
        return sides;
    }

    renderImage = ({ item, index }) => (
        <TouchableOpacity onPress={() => this.setState({select_image_index: index})} style={{width: '31%', margin: 4}}>
            <Image
                key={index}
                style={{
                    width: '100%',
                    height: 140
                }}
                resizeMode={"cover"}
                source={{ uri: item.uri }}
            />
        </TouchableOpacity>
        );

    render(){
        const {navigation, theme} = this.props;
        const {isLoading, data, select_image_index, showGallery} = this.state;
        return (
            <PageContainer
                navigation={navigation}
                title={I18n.t('New_post')}
                headerRight={() => <HeaderButton.Next onPress={this.onNext} testID='rooms-list-view-sidebar' />}
            >
                <StatusBar/>
                {
                    isLoading && <ActivityIndicator absolute theme={theme} size={'large'}/>
                }
                {
                    data.length ?
                        <>
                            <TouchableOpacity style={[styles.selectImageContainer, {paddingTop: 100 + getStatusBarHeight(true)}]} onPress={() => this.setState({showGallery: true})}>
                                <Image source={{uri: data[select_image_index].uri}} style={styles.selectImage} resizeMode='contain'/>
                            </TouchableOpacity>
                            <Text style={styles.recentText}>{I18n.t('Recent')}</Text>
                            <FlatList
                                data={data}
                                style={{flex: 1}}
                                contentContainerStyle={{alignItems: 'center'}}
                                numColumns={3}
                                renderItem={this.renderImage}
                            />
                        </> :
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>{I18n.t('No_files_in_device')}</Text>
                        </View>

                }
                {
                    showGallery &&
                    <View style={styles.galleryView}>
                        <Swiper
                            loop={false}
                            index={select_image_index}
                            ref={ref => this.swipe = ref}
                            onIndexChanged={(index) => this.setState({select_image_index: index})}
                            containerStyle={styles.swipeContainer}
                        >
                            {this.renderSlides()}
                        </Swiper>
                    </View>
                }
            </PageContainer>
        );
    }
}

const mapStateToProps = state => ({
    user: state.login.user
})

const mapDispatchToProps = dispatch =>({
    setUser: params => dispatch(setUserAction(params))
})

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(PickLibraryView));
