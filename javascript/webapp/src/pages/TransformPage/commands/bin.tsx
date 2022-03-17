/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	Step,
	TableContainer,
	TableStore,
} from '@data-wrangling-components/core'
import { Verb } from '@data-wrangling-components/core'
import type { ICommandBarItemProps } from '@fluentui/react'

import type {
	StepAddFunction,
	StepRemoveFunction,
	StepUpdateFunction,
} from '../TransformPage.types.js'
import { columnStepCommand } from './columnStepCommand.js'

export function bin(
	input: TableContainer | undefined,
	store: TableStore,
	steps: Step[],
	column: string,
	onAddStep: StepAddFunction,
	onUpdateStep: StepUpdateFunction,
	onRemoveStep: StepRemoveFunction,
): ICommandBarItemProps {
	return columnStepCommand(
		input,
		store,
		Verb.Bin,
		steps,
		column,
		onAddStep,
		onUpdateStep,
		onRemoveStep,
		{
			title: `Bin column ${column}`,
			iconProps: { iconName: 'ReportDocument' },
		},
	)
}
