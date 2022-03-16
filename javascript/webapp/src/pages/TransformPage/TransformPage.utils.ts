/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step } from '@data-wrangling-components/core'
import { isMatch, uniqueId } from 'lodash'

/**
 * Allow each verb command to create a partial step which we force to have
 * everything required
 * @param step
 * @returns
 */
export function createStep(step: Partial<Step>): Step {
	return {
		// TODO: overriding description for comparisons temporarily until we institute a step ID
		description: uniqueId(),
		verb: step.verb!,
		args: {},
		// these will be set by the pipeline runner
		input: '',
		output: '',
		...step,
	}
}

/**
 * Find a step within a list.
 * TODO: using the description field for now, steps should get an ID
 * @param steps
 * @param step
 * @returns
 */
export function findById(steps: Step[], step: Partial<Step>): number {
	return steps.findIndex(s => s.description === step.description)
}

export function findStep<T>(
	steps: Step[],
	template: Partial<Step<T>>,
): Step | undefined {
	return steps.find(step => isMatch(step.args as any, template.args as any))
}
