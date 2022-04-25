/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

/**
 * A utility identity function
 */
export const identity = <T>(value?: T): T | undefined => value

/**
 * Converts a string value to a numeric
 * @param value - the string value
 * @returns The string cast as a number (if defined)
 */
export const num = (value?: string): number | undefined => {
	if (value) {
		return +value
	}
}

/**
 * Creates a callback that returns a static value
 * @param value - the value to prime the function with
 * @returns A callback that returns the given value
 */
export const staticCallback =
	<T>(value: T) =>
	(): T =>
		value
