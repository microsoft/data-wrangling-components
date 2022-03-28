/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step } from '@data-wrangling-components/core'
import { createDefaultCommandBar } from '@data-wrangling-components/react'
import { useMemo } from 'react'

import { convert } from '../commands/convert.js'
import { groupby } from '../commands/groupby.js'
import { orderby } from '../commands/orderby.js'
import type {
	StepAddFunction,
	StepRemoveFunction,
	StepUpdateFunction,
} from '../TransformPage.types.js'

export function usePerColumnCommands(
	steps: Step[],
	onAddStep: StepAddFunction,
	onUpdateStep: StepUpdateFunction,
	onRemoveStep: StepRemoveFunction,
): any {
	return useMemo(() => {
		return (props: any) => {
			const column = props?.column.key
			return createDefaultCommandBar({
				items: [
					convert(
						column,
						steps,

						onAddStep,
						onUpdateStep,
						onRemoveStep,
					),
					groupby(
						column,
						steps,

						onAddStep,
						onUpdateStep,
						onRemoveStep,
					),
					orderby(
						column,
						steps,

						onAddStep,
						onUpdateStep,
						onRemoveStep,
					),
				],
			})
		}
	}, [steps, onAddStep, onRemoveStep, onUpdateStep])
}
