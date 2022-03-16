/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step } from '@data-wrangling-components/core'
import { Verb } from '@data-wrangling-components/core'
import type { ICommandBarItemProps } from '@fluentui/react'

import type {
	StepAddFunction,
	StepRemoveFunction,
	StepUpdateFunction,
} from '../TransformPage.types.js'
import { columnListStepCommand } from './columnListStepCommand.js'

export function groupby(
	steps: Step[],
	column: string,
	onAddStep: StepAddFunction,
	onUpdateStep: StepUpdateFunction,
	onRemoveStep: StepRemoveFunction,
): ICommandBarItemProps {
	return columnListStepCommand(
		steps,
		column,
		onAddStep,
		onUpdateStep,
		onRemoveStep,
		{
			verb: Verb.Groupby,
			args: {},
		},
		{
			key: 'groupby',
			text: 'Groupby',
		},
		{
			title: 'Group by column',
			iconProps: {
				iconName: 'GroupList',
			},
		},
	)
}
