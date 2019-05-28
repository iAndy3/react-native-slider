import React, {Component, Fragment} from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';

import Slider from './slider';

export default class SliderDemo extends Component {

	state = {
		isMoving: false,
		value: 6.8
	}

	onValueChangeStart = () => {
		this.setState({
			isMoving: true
		});
	}

	onValueChangeEnd = value => {
		this.setState({
			value,
			isMoving: false
		});
	}

	getSliderApi = api => {
		this.sliderApi = api;
	}

	getValueFromApi = () => {
		this.setState({
			valueFromApi: this.sliderApi.getValue()
		});
	}

	render() {
		let {isMoving, value} = this.state;

		return (
			<View style={{flex: 1}}>
				<Text>Current state: {isMoving ? 'Moving' : 'Not moving'}</Text>
				<Text>Value from callback: {value}</Text>
				<TouchableOpacity onPress={this.getValueFromApi}>
					<Text>Value from api (click): {this.state.valueFromApi}</Text>
				</TouchableOpacity>
				<Slider 
					displaySteps
					snapEnabled
					value={value}
					stepSize={0.20}
					minimumValue={5}
					maximumValue={7}
					originPoint={6.2}
					wraperStyle={sliderStyles.wraper}
					onValueChangeStart={this.onValueChangeStart}
					onValueChangeEnd={this.onValueChangeEnd}
					exposeApi={this.getSliderApi} />

				<Text>minValue: 1 | maxValue: 7 | originPoint: 4 | value: 5</Text>
				<Slider 
					displaySteps
					snapEnabled
					value={5}
					stepSize={1}
					minimumValue={1}
					maximumValue={7}
					originPoint={4}
					wraperStyle={sliderStyles.wraper} />

				<Text>displaySteps: false | minValue: 1 | maxValue: 5 | originPoint: 1 | value: 3 | stepSize: 0.5</Text>
				<Slider 
					snapEnabled
					value={3}
					stepSize={0.5}
					minimumValue={1}
					maximumValue={5}
					originPoint={1}
					wraperStyle={sliderStyles.wraper} />

				<Text>snapEnabled: false | minValue: 1 | maxValue: 100 | originPoint: 70 | value: 30</Text>
				<Slider 
					snapEnabled={false}
					value={30}
					minimumValue={1}
					maximumValue={100}
					originPoint={70}
					wraperStyle={sliderStyles.wraper} />

				<Text>disabled: true</Text>
				<Slider 
					disabled
					pointerDisabledStyle={sliderStyles.disabled}
					highlighterDisabledStyle={sliderStyles.disabled}
					snapEnabled={false}
					value={30}
					minimumValue={1}
					maximumValue={100}
					originPoint={70}
					wraperStyle={sliderStyles.wraper} />
			</View>
		);
	}
}

const sliderStyles = StyleSheet.create({
	wraper: {
		width: 400, 
		height: 60, 
		backgroundColor: '#eee'
	},
	disabled: {
		backgroundColor: 'grey'
	}
});