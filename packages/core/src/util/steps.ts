/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Step } from '..'

const inputColumnSteps: Record<string, boolean> = {
	aggregate: true,
	bin: true,
	binarize: true,
	filter: true,
	recode: true,
	rollup: true,
	sample: true,
	spread: true,
	unroll: true,
}

/**
 * Indicates whether the supplied step requires an input column.
 * @param step
 * @returns
 */
export function isInputColumnStep(step: Step): boolean {
	return !!inputColumnSteps[step.verb]
}
