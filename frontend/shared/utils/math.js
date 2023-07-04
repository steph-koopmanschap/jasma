/**
 * Clamp value within specified range
 * @param {Number} val
 * @param {Number} min
 * @param {Number} max
 * @returns {Number} value or min/max if it overflows
 */

export function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
}

/**
 *
 * @param {Number} value current value
 * @param {Number} min value that you want to be considered as 0 or start on the range
 * @param {Number} max value that you want to be considered as 1 or end on the range
 * @returns {Number} normalized value within 0-1 range
 */

export function normilize(value, min, max) {
    return (value - min) / (max - min);
}

/**
 * Map (convert) value from one range to another range
 * @param {Number} val current value you want to map
 * @param {Number} sourceMin min value of the range you want to map from
 * @param {Number} sourceMax max value of the range you want to map from
 * @param {Number} destMin min value of the range you want to map to
 * @param {Number} destMax max value of the range you want to map to
 * @returns {Number} exact value on the destination range
 *
 * Example:
 * You want to track your mouse on Y axis and based on its Y pos enlarge or shrink radius of a circle on the screen.
 * Your mouse range is 0 - 600 on Y axis and your circle radius can be only between 20 and 360 for example. So when mouse is at 0 Y axis circle is 20 radius and when mouse is at 600 Y axis radius is 360.
 * Using this params you will get: map(val: currentMousePos, sourceMin: 0, sourceMax: 600, destMin: 20, destMax: 360) => exact value within 20-360 range.
 */

export function mapRanges(val, sourceMin, sourceMax, destMin, destMax) {
    return lerp(normilize(val, sourceMin, sourceMax), destMin, destMax);
}

/**
 * Opposite of normalization
 * @param {Number} norm normalized value within 0-1 range
 * @param {Number} min minimum value of the current range
 * @param {Number} max maximum value of the current range
 * @returns {Number} exact value on the specified range
 *
 * Example:
 * You have a line drawn on a screen where starting point X is 100 and end point X is 450 and you know you want to draw a point on that line within that range at 37 percent.
 * Now you need exact value instead of percent so you have to convert it using function: lerp(norm: 0.37, min: 100, max: 450) => 229.5 is you exact X pos on the screen.
 */

export function lerp(norm, min, max) {
    return (max - min) * norm + min;
}
