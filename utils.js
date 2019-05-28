export const isFunction = fn => typeof fn === 'function';

export const snapPointerToValue = (currentXPosition, stepWidth) => {
	let stepsMade = Math.round(currentXPosition / stepWidth),
		newPosition = stepsMade * stepWidth;

	return newPosition;
}

export const getSteps = (minimumValue, maximumValue, stepSize, snapEnabled) => {
	if(snapEnabled) {
		return (maximumValue - minimumValue) / stepSize;
	} else {
		return maximumValue - minimumValue;
	}
}

export const getDisplayValue = (value, stepWidth, stepSize, minimumValue, snapEnabled) => {
	if(snapEnabled) {
		return (Math.round(value / stepWidth) * stepSize) + minimumValue
	} else {
		return parseFloat(((value / stepWidth) + minimumValue).toFixed(2));
	}
}

export const getInitialLeftPosition = (value, minimumValue, stepWidth, stepSize, snapEnabled) => {
	if(snapEnabled) {
		return stepWidth * ((value - minimumValue) / stepSize);
	} else {
		return stepWidth * (value - minimumValue);
	}
}

export const getPreviousLeftValue = (newPosition, leftBoundary, rightBoundary, snapEnabled, stepWidth) => {
	if(newPosition < leftBoundary) {
		return leftBoundary;
	} else if(newPosition > rightBoundary) {
		return rightBoundary;
	} else {
		if(snapEnabled) {
			return Math.round(newPosition / stepWidth) * stepWidth;
		} else {
			return newPosition;
		}
	}
}

export const getPositionForHighlighter = (originPoint, value, stepWidth, stepSize, pointerWidth, minimumValue, xOffset) => {
	let originPointXPosition = ((originPoint - minimumValue) / stepSize) * stepWidth + (pointerWidth / 2) + xOffset,
		distanceTowardsOriginPoint = Math.abs(value - originPoint) / stepSize,
		highlighterWidth = stepWidth * distanceTowardsOriginPoint;

	if(originPoint <= value) {
		return {
			left: originPointXPosition,
			width: highlighterWidth
		};
	} else {
		return {
			left: originPointXPosition - (distanceTowardsOriginPoint * stepWidth),
			width: highlighterWidth
		};
	}
}