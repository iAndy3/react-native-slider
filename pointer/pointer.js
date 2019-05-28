import React from 'react';
import {PanResponder, Animated, View} from 'react-native';

import {getDisplayValue, getInitialLeftPosition, getPreviousLeftValue, isFunction} from './../utils';

export default class Pointer extends React.PureComponent {

	static defaultProps = {
		parentSize: {
			width: 0,
			height: 0
		}
	};

	panResponder = {};
	pointerHeight = 0;
	pointerWidth = 0;
	previousLeft = 0;
	xPosition = 0;

	state = {
		xPosition: new Animated.Value(0),
		isReady: false
	};

	componentDidMount() {
		let {exposeApi} = this.props;

		this.panResponder = PanResponder.create({
			onStartShouldSetPanResponder: this.handleStartShouldSetPanResponder,
			onMoveShouldSetPanResponder: this.handleMoveShouldSetPanResponder,
			onPanResponderGrant: this.handlePanResponderGrant,
			onPanResponderMove: this.handlePanResponderMove,
			onPanResponderRelease: this.handlePanResponderEnd
		});

		isFunction(exposeApi) && exposeApi({
			setValue: this.setValue,
			getValue: this.getValue
		});
	}

	componentDidUpdate(prevProps) {
		if(this.props.stepWidth !== prevProps.stepWidth) {
			this.init();
		}
	}

	setPointerWidth = event => {
		let {width = 0, height = 0} = event.nativeEvent.layout;
		
		this.pointerWidth = width;
		this.pointerHeight = height;

		this.init();

		this.props.getPointerSize({
			width,
			height
		});

		this.setState({
			isReady: true
		});
	};

	init = () => {
		let {parentSize, value, minimumValue, stepWidth, stepSize, snapEnabled, xOffset} = this.props;

		this.previousLeft = getInitialLeftPosition(value, minimumValue, stepWidth, stepSize, snapEnabled);
		this.rightBoundary = parentSize.width - this.pointerWidth - xOffset;
		this.leftBoundary = 0;

		this.state.xPosition.setValue(this.previousLeft);
		this.state.xPosition.addListener(({value}) => this.xPosition = value);
	};

	handleStartShouldSetPanResponder = () => !this.props.disabled;

	handleMoveShouldSetPanResponder = () => !this.props.disabled;

	handlePanResponderGrant = () => {
		let {onValueChangeStart} = this.props;

		this.highlightPointer();

		isFunction(onValueChangeStart) && onValueChangeStart();
	};

	handlePanResponderMove = (event, gestureState) => {
		let {updateHighlighterPosition} = this.props,
			newXPosition = this.getXPosition(this.previousLeft + gestureState.dx);

		this.state.xPosition.setValue(newXPosition);
		updateHighlighterPosition(this.getValue());
	};

	handlePanResponderEnd = (event, gestureState) => {
		let {onValueChangeEnd} = this.props,
			newXPosition = this.getXPosition(this.previousLeft + gestureState.dx);
			
		this.previousLeft = newXPosition;
		
		this.unHighlightPointer();

		isFunction(onValueChangeEnd) && onValueChangeEnd(this.getValue());
	};

	getXPosition = newPosition => {
		let {disabled, snapEnabled, stepWidth} = this.props;

		if(disabled) {
			return 0;
		} else {
			return getPreviousLeftValue(newPosition, this.leftBoundary, this.rightBoundary, snapEnabled, stepWidth);
		}
	};

	setValue = newPosition => {
		if(this.props.disabled) return;

		let newXPosition = this.getXPosition(newPosition);

		this.previousLeft = newXPosition;
		this.state.xPosition.setValue(newXPosition);

		return this.getValue();
	};

	getValue = () => {
		let {minimumValue, maximumValue, snapEnabled, stepWidth, stepSize} = this.props;

		return getDisplayValue(this.xPosition, stepWidth, stepSize, minimumValue, snapEnabled);
	};

	highlightPointer = () => {
		let {pointerFocusStyle} = this.props;

		if(pointerFocusStyle) {
			this.updatePointerStyle({
				style: pointerFocusStyle
			});
		}
	};

	unHighlightPointer = () => {
		let {pointerFocusStyle, pointerDefaultStyle} = this.props;

		if(pointerFocusStyle) {
			this.updatePointerStyle({
				style: pointerDefaultStyle
			});
		}
	};

	getPointerRef = ref => {
		this.pointerRef = ref;
	};

	updatePointerStyle = pointerStyle => {
		this.pointerRef && this.pointerRef.setNativeProps(pointerStyle);
	};

	render() {
		let {pointerDefaultStyle, pointerDisabledStyle, parentSize: {height: parentHeight}, yOffset, inactive, pointerInactiveStyle, touchableAreaSize} = this.props,
			pointerPosition = {
				padding: touchableAreaSize,
				position: 'absolute',
				transform: [{
					translateX: this.state.xPosition,
				}, {
					translateY: (parentHeight / 2) - (this.pointerHeight / 2) - yOffset
				}]
			},
			visible = {
				opacity: this.state.isReady && parentHeight ? 1 : 0
			}

		return (
			<Animated.View 
				onLayout={this.setPointerWidth} 
				style={[pointerPosition, visible]}
				{...this.panResponder.panHandlers}>

				<View 
					testID="Pointer"
					ref={this.getPointerRef} 
					style={[pointerDefaultStyle, pointerDisabledStyle, inactive && pointerInactiveStyle]} />
			</Animated.View>
		);
	}
}