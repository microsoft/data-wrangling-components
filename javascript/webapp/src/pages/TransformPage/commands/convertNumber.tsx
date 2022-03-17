/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	Step,
	TableContainer,
	TableStore,
} from '@data-wrangling-components/core'
import { ParseType, Verb } from '@data-wrangling-components/core'
import type { ICommandBarItemProps } from '@fluentui/react'

import type {
	StepAddFunction,
	StepRemoveFunction,
	StepUpdateFunction,
} from '../TransformPage.types.js'
import { columnListStepCommand } from './columnListStepCommand.js'

export function convertNumber(
	input: TableContainer | undefined,
	store: TableStore,
	steps: Step[],
	column: string,
	onAddStep: StepAddFunction,
	onUpdateStep: StepUpdateFunction,
	onRemoveStep: StepRemoveFunction,
): ICommandBarItemProps {
	return columnListStepCommand(
		input,
		store,
		Verb.Convert,
		steps,
		column,
		onAddStep,
		onUpdateStep,
		onRemoveStep,
		{
			verb: Verb.Convert,
			args: {
				type: ParseType.Decimal,
			},
		},
		{
			key: 'convert',
			text: 'Convert to number',
		},
		{
			title: `Convert column data to numbers`,
			iconProps: {
				iconName: 'NumberSymbol',
			},
		},
	)
}
