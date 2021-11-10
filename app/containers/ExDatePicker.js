import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, Platform, View, ScrollView, TouchableOpacity} from 'react-native';
import I18n from '../i18n';
import moment from 'moment';
import {date_str_format, DATE_STRING_DISPLAY_FORMAT, DATE_STRING_FORMAT, dateToString} from '../utils/datetime';
import {COLOR_BLACK, COLOR_YELLOW, DARK_WEAK, HEADER_BAR_END, HEADER_BAR_START, themes} from '../constants/colors';
import sharedStyles from '../views/Styles';
import {isIOS} from '../utils/deviceInfo';
import {VectorIcon} from './VectorIcon';
import scrollPersistTaps from '../utils/scrollPersistTaps';
import LinearGradient from 'react-native-linear-gradient';
import PropTypes from 'prop-types';
import {StripeProviderProps} from "@stripe/stripe-react-native";

const styles = StyleSheet.create({
	container: {
		flex:1,
		marginBottom: 10,
	},
	label: {
		marginBottom: 4,
		fontSize: 14,
		...sharedStyles.textSemibold
	},
	content: {

	},
	selectContainer: {
		flex: 1,
		borderRadius: 12,
		paddingHorizontal: 12,
		paddingBottom: 8,
		width: '100%',
		zIndex:999999,
		height: 150
	},
	valueContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		position: 'relative',
		paddingRight: 12,
		borderRadius: 24,
		borderWidth: 1,
		height: 36
	},
	selectContent: {
		flexDirection: 'row',
		height: 120
	},
	headerContainer: {
		height: 36,
		position: 'relative',
		alignItems: 'center',
		justifyContent: 'center',
	},
	doneText: {
		color: 'white',
		position: 'absolute',
		right: 4,
		top: 8,
		fontWeight: 'bold'
	},
	daySelect: {
		width: 80
	},
	monthSelect: {
		flexGrow: 1,
		marginHorizontal: 8,
	},
	yearSelect: {
		width: 80
	},
	selectHeader: {
		textAlign: 'center',
		fontSize: 16
	},
	selectedStyle: {
		paddingVertical: 4,
		paddingHorizontal: 8,
		borderRadius: 8,
		backgroundColor: COLOR_YELLOW
	},
	selectStyle: {
		paddingVertical: 4,
		paddingHorizontal: 8
	},
	selectValue: {
		color: 'white',
		fontWeight: 'bold',
		fontSize: 16,
		textAlign: 'center'
	},
	value: {
		marginRight: 12
	},
	iconStyle: {
		position: 'absolute',
		right: 12,
	}
});

const SELECT_DAYS = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
const SELECT_MONTHS = [
	I18n.t('January'),
	I18n.t('February'),
	I18n.t('March'),
	I18n.t('April'),
	I18n.t('May'),
	I18n.t('June'),
	I18n.t('July'),
	I18n.t('August'),
	I18n.t('September'),
	I18n.t('October'),
	I18n.t('November'),
	I18n.t('December')
];

class ExDatePicker extends React.Component{
	static propTypes = {
		label: PropTypes.string,
		containerStyle: PropTypes.object,
		value: PropTypes.string,
		action: PropTypes.func,
		toggleShow: PropTypes.func,
		topScrollEnable: PropTypes.bool,
		theme: PropTypes.string
	};

	constructor(props) {
		super(props);
		this.state = {
			show: false,
			currentDate: props.value,
			day: 1,
			month: 0,
			year: 1970
		}
	}

	componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS) {
		const {topScrollEnable} = this.props;
		if(prevProps.topScrollEnable !== topScrollEnable && this.state.show){
			this.setState({show: !topScrollEnable});
		}
	}

	onChangeDay = (day) => {
		const {year, month} = this.state;
		const dateObject = new Date(year, month, day);
		const newDate = date_str_format(dateObject, 'mm/dd/y');
		this.setState({currentDate: newDate, day})
		this.props.action({ value: newDate});
	};

	onChangeMonth = (month) => {
		const {year, day} = this.state;
		const dateObject = new Date(year, month, day);
		const newDate = date_str_format(dateObject, 'mm/dd/y');
		this.setState({currentDate: newDate, month})
		this.props.action({ value: newDate});
	};

	onChangeYear = (year) => {
		const {month, day} = this.state;
		const dateObject = new Date(year, month, day);
		const newDate = date_str_format(dateObject, 'mm/dd/y');
		this.setState({currentDate: newDate, year})
		this.props.action({ value: newDate});
	};

	setShow = (show) => {
		const {value} = this.props;

		if(show && value){
			const date = new Date(value);
			this.setState({year: date.getFullYear(), month: date.getMonth(), day: date.getDate(), show});
		} else {
			this.setState({show});
		}
		this.props.toggleShow(show);

		setTimeout(() => {
			if(this.scrollYear){
				this.scrollYear.scrollTo({x: 0, y: (this.state.year - 1971) * 28, animated: false});
			}
			if(this.scrollMonth){
				this.scrollMonth.scrollTo({x: 0, y: this.state.month * 28, animated: false});
			}
			if(this.scrollDay){
				this.scrollDay.scrollTo({x: 0, y: (this.state.day - 1) * 28, animated: false});
			}
		}, 300);
	}

	render(){
		const {year, month, day, show, currentDate} = this.state;
		const {label, containerStyle, theme} = this.props;

		const renderYears = [];
		for(let i=1970; i<2050; i++){
			renderYears.push(<TouchableOpacity onPress={() => this.onChangeYear(i)} style={i === year ? styles.selectedStyle: styles.selectStyle}><Text style={styles.selectValue}>{i}</Text></TouchableOpacity>);
		}

		return (
			<View style={[styles.container, containerStyle]}>
				{label ? (
					<Text
						contentDescription={null}
						accessibilityLabel={null}
						style={[
							styles.label,
							{ color: themes[theme].infoText }
						]}
					>
						{label}
					</Text>
				) : null}
				<View style={styles.content}>
					{
						show ?
							<LinearGradient colors={[DARK_WEAK, COLOR_BLACK]} style={styles.selectContainer}>
								<TouchableOpacity onPress={() => this.setShow(false)} style={styles.headerContainer}>
									<VectorIcon style={"FontAwesome5"} name={"chevron-up"} color={'white'} size={20}/>
									<Text style={styles.doneText}>{I18n.t('Done')}</Text>
								</TouchableOpacity>
								<View style={styles.selectContent}>
									<View style={styles.daySelect}>
										<Text style={styles.selectHeader}>{I18n.t('Day')}</Text>
										<ScrollView
											style={{flex: 1}}
											contentContainerStyle={{paddingVertical: 8}}
											showsVerticalScrollIndicator={false}
											{...scrollPersistTaps}
											ref={(ref) => {
												this.scrollDay = ref;
											}}
										>
											{
												SELECT_DAYS.map(d =>
													<TouchableOpacity onPress={() => this.onChangeDay(d)} style={d === day ? styles.selectedStyle: styles.selectStyle}>
														<Text style={styles.selectValue}>{d}</Text>
													</TouchableOpacity>)
											}
										</ScrollView>
									</View>
									<View style={styles.monthSelect}>
										<Text style={styles.selectHeader}>{I18n.t('Month')}</Text>
										<ScrollView
											style={{flex: 1}}
											contentContainerStyle={{flexGrow: 1, paddingVertical: 8}}
											showsVerticalScrollIndicator={false}
											{...scrollPersistTaps}
											ref={(ref) => {
												this.scrollMonth = ref;
											}}
										>
											{
												SELECT_MONTHS.map((m, index)=>
													<TouchableOpacity onPress={() => this.onChangeMonth(index)} style={index === month ? styles.selectedStyle: styles.selectStyle}>
														<Text style={styles.selectValue}>{m}</Text>
													</TouchableOpacity>)
											}
										</ScrollView>
									</View>
									<View style={styles.yearSelect}>
										<Text style={styles.selectHeader}>{I18n.t('Year')}</Text>
										<ScrollView
											style={{flex: 1}}
											contentContainerStyle={{flexGrow: 1, paddingVertical: 8}}
											showsVerticalScrollIndicator={false}
											{...scrollPersistTaps}
											ref={(ref) => {
												this.scrollYear = ref;
											}}
										>
											{renderYears}
										</ScrollView>
									</View>
								</View>
							</LinearGradient>
							:
							<TouchableOpacity onPress={() => this.setShow(true)} style={[styles.valueContainer, {borderColor: themes[theme].separatorColor}]}>
								<Text style={[styles.value, {color: themes[theme].sideTitleText}]}>{currentDate?date_str_format(currentDate, DATE_STRING_DISPLAY_FORMAT):null}</Text>
								<VectorIcon type={"FontAwesome5"} name={"chevron-down"} color={themes[theme].infoText} size={20} style={styles.iconStyle}/>
							</TouchableOpacity>
					}
				</View>
			</View>
		);
	}
}


export default ExDatePicker;
