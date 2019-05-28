import React, {Component, Fragment} from 'react';
import {View} from 'react-native';

import Pointer from './pointer/pointer';
import Track from './track/track';

import {getSteps, isFunction} from './utils';

export default class Slider extends Component {

	/**
	 * Slider component
	 * @param  {number} value - Current value of the slider - it is changing whenever the pointer is moved.
	 * @param  {boolean} disabled - If set on `false`, the slider will be static, so the pointer will not move.
	 * @param  {boolean} inactive - If set on `true`, the slider will have a different style.
	 * @param  {number} originPoint - Specifies the point/position from where the highlight will be displayed. Usualy the origin point will be same as `minimumValue`.
	 * @param  {number} stepSize - Used with `snapEnabled` set on `true`, it specifies the distance between one step to another.
	 * @param  {number} touchableAreaSize - Specifies the size for touchable area of the pointer. 
	 * @param  {boolean} snapEnabled - If set on `true`, the point will snap to the closest available location based on `stepSize`.
	 * @param  {boolean} displaySteps - If set on `true` it will display the steps of the grid where the point will snap.
	 * @param  {number} minimumValue - Minimum value.
	 * @param  {number} maximumValue - Maximum value.
	 * @param  {number} yOffset - Offset for vertical will be used if the parent has a border or any property that affects the width of it.
	 * @param  {number} xOffset - Offset for horizontal will be used if the parent has a border or any property that affects the width of it.
	 * @param  {object} wraperStyle - Usualy used for positioning the Slider on the page.
	 * @param  {string} trackStepColor - Sets the color for steps, if the `displaySteps` property is `true`.
	 * @param  {object} pointerDefaultStyle - Sets default style for the pointer.
	 * @param  {object} pointerDisabledStyle - Sets default style for the pointer when it's disabled.
	 * @param  {object} pointerInactiveStyle - Sets default style for the pointer when it's inactive.
	 * @param  {object} pointerFocusStyle - Sets style for the pointer when it is focused (moved).
	 * @param  {object} trackTouchableStyle - Sets style for the touchable bar.
	 * @param  {object} trackDefaultStyle - Sets style for the track bar.
	 * @param  {object} trackDisabledStyle - Sets style for the track bar when it's disabled.
	 * @param  {object} highlighterDefaultStyle - Sets style for highlighter.
	 * @param  {object} highlighterDisabledStyle - Sets style for highlighter when it's disabled.
	 * @param  {object} exposeApi - Exposes slider api.
	 *         {function} exposeApi.setValue - Sets the value of the slider.
	 *         {function} exposeApi.getValue - Returns the value of the slider.
	 */

	static defaultProps = {
		value: 3,
		disabled: false,
		originPoint: 5,
		displaySteps: false,
		inactive: false,
		snapEnabled: false,
		minimumValue: 0,
		maximumValue: 10,
		stepSize: 1,
		yOffset: 0,
		xOffset: 0,
		touchableAreaSize: 10,
		wraperStyle: {},
		trackStepColor: '#C6CBD9',
		pointerDefaultStyle: {
			backgroundColor: '#0885FF',
			width: 8,
			height: 16,
			borderRadius: 4
		},
		pointerFocusStyle: {
			backgroundColor: '#08A5FF',
		},
		pointerInactiveStyle: {
			backgroundColor: '#FFFFFF',
			borderWidth: 1,
			borderColor: '#0885FF')
		},		
		pointerDisabledStyle: {},
		trackDefaultStyle: {
			borderRadius: 5,
			backgroundColor: '#C6CBD9',
			height: 4,
			opacity: 0.4
		},
		trackDisabledStyle: {},
		highlighterDefaultStyle: {
			height: 4,
			backgroundColor: '#0885FF',
		},
		highlighterDisabledStyle: {},
		trackTouchableStyle: {
			height: 30
		}
	};

	pointerApi = {};

	state = {
		stepWidth: 0,
		parentSize: {
			height: 0,
			width: 0
		},
		pointerSize: {
			height: 0,
			width: 0
		},
	};

	setParentSize = event => {
		let {height, width} = event.nativeEvent.layout;

		this.setState({
			parentSize: {
				height,
				width
			}
		});
	}

	setPointerOnTrack = newXPosition => {
		let {setValue} = this.pointerApi;

		if(isFunction(setValue)) {
			let {onValueChangeEnd} = this.props,
				newPosition = setValue(newXPosition);

			this.updateHighlighterPosition(newPosition);
			isFunction(onValueChangeEnd) && onValueChangeEnd(newPosition);
		} 
	}

	getPointerSize = pointerSize => {
		let {parentSize: {width: parentWidth}} = this.state,
			{snapEnabled, maximumValue, minimumValue, stepSize, xOffset} = this.props,
			steps = getSteps(minimumValue, maximumValue, stepSize, snapEnabled),
			stepWidth = (parentWidth - pointerSize.width - xOffset) / steps;

		this.setState({
			steps,
			stepWidth,
			pointerSize
		});
	}

	getPointerApi = api => {
		let {exposeApi} = this.props;

		this.pointerApi = api;

		isFunction(exposeApi) && exposeApi(api);
	}

	getTrackApi = api => {
		this.trackApi = api;
	}

	updateHighlighterPosition = value => {
		this.trackApi.setNewHighlighterPositions(value);
	}

	renderSlider = () => {
		let {parentSize, pointerSize, stepWidth, steps} = this.state,
			{onValueChangeStart, onValueChangeEnd, originPoint, disabled, displaySteps, value, yOffset, xOffset, touchableAreaSize, snapEnabled, minimumValue, maximumValue, stepSize, inactive, pointerInactiveStyle, trackStepColor, trackTouchableStyle, pointerDefaultStyle, pointerFocusStyle, trackDefaultStyle, highlighterDefaultStyle, pointerDisabledStyle, trackDisabledStyle, highlighterDisabledStyle} = this.props;

		if(parentSize.width && parentSize.height) {
			return (
				<Fragment>
					<Track 
						value={value}
						originPoint={originPoint}
						minimumValue={minimumValue}
						maximumValue={maximumValue}

						steps={steps}
						stepSize={stepSize}
						stepWidth={stepWidth}

						disabled={disabled}
						snapEnabled={snapEnabled}
						displaySteps={displaySteps}

						yOffset={yOffset}
						xOffset={xOffset}

						parentSize={parentSize} 
						pointerSize={pointerSize} 

						trackStepColor={trackStepColor}
						trackDefaultStyle={trackDefaultStyle}
						trackTouchableStyle={trackTouchableStyle}
						highlighterDefaultStyle={highlighterDefaultStyle}
						trackDisabledStyle={trackDisabledStyle}
						highlighterDisabledStyle={highlighterDisabledStyle}

						exposeApi={this.getTrackApi}

						setPointerOnTrack={this.setPointerOnTrack} />

					<Pointer 
						value={value}
						minimumValue={minimumValue}
						maximumValue={maximumValue}
						touchableAreaSize={touchableAreaSize}

						stepSize={stepSize}
						stepWidth={stepWidth}

						yOffset={yOffset}
						xOffset={xOffset}

						disabled={disabled}
						snapEnabled={snapEnabled}

						parentSize={parentSize} 
						getPointerSize={this.getPointerSize} 

						inactive={inactive}
						pointerInactiveStyle={pointerInactiveStyle}

						pointerFocusStyle={pointerFocusStyle}
						pointerDefaultStyle={pointerDefaultStyle}
						pointerDisabledStyle={pointerDisabledStyle}
						
						exposeApi={this.getPointerApi} 
						
						updateHighlighterPosition={this.updateHighlighterPosition}
						
						onValueChangeEnd={onValueChangeEnd}
						onValueChangeStart={onValueChangeStart} />
				</Fragment>
			);
		} else {
			return null;
		}
	}

	render() {
		return (
			<View style={this.props.wraperStyle} onLayout={this.setParentSize}>
				{this.renderSlider()}
			</View>
		);
	}
}