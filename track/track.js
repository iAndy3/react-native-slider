import React, {Component} from 'react';
import {TouchableOpacity, View, Animated} from 'react-native';

import {getPositionForHighlighter, isFunction} from '../utils';

export default class Track extends Component {

	static defaultProps = {
		parentSize: {
			width: 0,
			height: 0
		},
		pointerSize: {
			height: 0,
			width: 0
		}
	};

	state = {
		highlighterXPosition: new Animated.Value(0),
		highlighterWidth: new Animated.Value(0)
	}

	componentDidMount() {
		let {value, exposeApi} = this.props;
		
		this.setNewHighlighterPositions(value);
		
		isFunction(exposeApi) && exposeApi({
			setNewHighlighterPositions: this.setNewHighlighterPositions
		});
	}

	componentDidUpdate(prevProps) {
		let {value, stepWidth} = this.props;

		if(stepWidth !== prevProps.stepWidth) {
			this.setNewHighlighterPositions(value);
		}
	}

	handleTrackPress = event => {
		let {setPointerOnTrack, disabled} = this.props,
			{locationX} = event.nativeEvent;

		!disabled && setPointerOnTrack(locationX);
	}

	setNewHighlighterPositions = value => {
		let {originPoint, xOffset, stepSize, stepWidth, minimumValue, pointerSize: {width: pointerWidth}} = this.props,
			{left, width} = getPositionForHighlighter(originPoint, value, stepWidth, stepSize, pointerWidth, minimumValue, xOffset);

		this.state.highlighterXPosition.setValue(left);
		this.state.highlighterWidth.setValue(width);
	}

	renderHighlighter = () => {
		let {highlighterDefaultStyle, highlighterDisabledStyle} = this.props,
			{highlighterXPosition, highlighterWidth} = this.state,
			highlighterStyle = {
				...highlighterDefaultStyle,
				...highlighterDisabledStyle,
				position: 'absolute',
				left: highlighterXPosition,
				width: highlighterWidth
			}

		return (
			<Animated.View pointerEvents="none" style={highlighterStyle} />
		)
	}

	getStyleForLastStep = step => {
		let {steps, trackStepColor} = this.props;

		if(step === steps - 1) {
			return {
				borderRightColor: trackStepColor,
				borderRightWidth: 1,
				borderStyle: 'dotted'
			};
		} else {
			return {};
		}
	}

	renderTrackSteps = () => {
		let {steps, stepWidth, trackStepColor, pointerSize: {width: pointerWidth}} = this.props;

		let stepWraperStyle = {
			flexGrow: 1, 
			flexDirection: 'row', 
			position: 'absolute', 
			left: pointerWidth / 2
		},	
		stepBaseStyle = {
			borderLeftColor: trackStepColor,
			borderLeftWidth: 1
		};

		return (
			<View pointerEvents="none" style={stepWraperStyle}>
				{Array(steps).fill().map((value, id) => <View key={id} style={[{width: stepWidth, height: 10}, stepBaseStyle, this.getStyleForLastStep(id)]} />)}
			</View>
		);
	}

	renderTouchableTrack = () => {
		let {trackDefaultStyle, trackTouchableStyle, trackDisabledStyle, displaySteps, parentSize: {width: parentWidth}, pointerSize: {width: pointerWidth}} = this.props,
			trackBaseStyle = {
				width: parentWidth - pointerWidth,
				transform: [{
					translateX: pointerWidth / 2,
				}]
			},
			trackTouchableBaseStyle = {
				justifyContent: 'center',
				flexGrow: 1
			}

		if(pointerWidth) {
			return (
				<TouchableOpacity 
					activeOpacity={0.8}
					onPress={this.handleTrackPress} 
					style={[trackTouchableBaseStyle, trackTouchableStyle]}>
					
					<View style={[trackDefaultStyle, trackDisabledStyle, trackBaseStyle]} />
					{displaySteps && this.renderTrackSteps()}
					{this.renderHighlighter()}
				</TouchableOpacity>
			);
		} else {
			return null;
		}
	}

	render() {
		return this.renderTouchableTrack();
	}
}