/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step } from '@data-wrangling-components/core'
import { Verb } from '@data-wrangling-components/core'
import type { ICommandBarItemProps } from '@fluentui/react'
import { IconButton } from '@fluentui/react'

import type {
	StepAddFunction,
	StepRemoveFunction,
	StepUpdateFunction,
} from '../TransformPage.types.js'
import { createStep, findStep } from '../TransformPage.utils.js'

export function groupby(
	steps: Step[],
	column: string,
	onAddStep: StepAddFunction,
	onUpdateStep: StepUpdateFunction,
	onRemoveStep: StepRemoveFunction,
): ICommandBarItemProps {
	return {
		key: 'groupby',
		text: 'Groupby',
		onRender: () => {
			const template = {
				verb: Verb.Groupby,
				args: {
					columns: [column],
				},
			}
			const step = findStep(steps, template)
			const click = () =>
				step ? onRemoveStep(step) : onAddStep(createStep(template))
			return (
				<IconButton
					title={`Group table by ${column} column`}
					checked={!!step}
					iconProps={{ iconName: 'GroupList' }}
					onClick={click}
				/>
			)
		},
	}
}
