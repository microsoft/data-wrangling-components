/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	InputColumnRecordArgs,
	Step,
} from '@data-wrangling-components/core'
import { useCallback } from 'react'

import type { StepChangeFunction } from '../types.js'

export function useColumnRecordDelete(
	step: Step<InputColumnRecordArgs>,
	onChange?: StepChangeFunction<InputColumnRecordArgs>,
): (column: string) => void {
	return useCallback(
		column => {
			const args = { ...step.args }
			delete args.columns[column]

			onChange?.({
				...step,
				args: {
					...step.args,
					...args,
				},
			})
		},
		[step, onChange],
	)
}
