/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step } from '@data-wrangling-components/core'
import { ParseType, Verb } from '@data-wrangling-components/core'
import type { ICommandBarItemProps } from '@fluentui/react'
import { IconButton } from '@fluentui/react'

import type {
	StepAddFunction,
	StepRemoveFunction,
	StepUpdateFunction,
} from '../TransformPage.types.js'
import { createStep, findStep } from '../TransformPage.utils.js'

export function convertNumber(
	steps: Step[],
	column: string,
	onAddStep: StepAddFunction,
	onUpdateStep: StepUpdateFunction,
	onRemoveStep: StepRemoveFunction,
): ICommandBarItemProps {
	return {
		key: 'convert',
		text: 'Convert to number',
		onRender: () => {
			const template = {
				verb: Verb.Convert,
				args: {
					columns: [column],
					type: ParseType.Decimal,
				},
			}
			const step = findStep(steps, template)
			const click = () =>
				step ? onRemoveStep(step) : onAddStep(createStep(template))
			return (
				<IconButton
					title={`Convert column data to numbers`}
					checked={!!step}
					iconProps={{ iconName: 'NumberSymbol' }}
					onClick={click}
				/>
			)
		},
	}
}
