/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step } from '@data-wrangling-components/core'
import type { ICommandBarItemProps } from '@fluentui/react'
import { IconButton } from '@fluentui/react'

import type {
	StepAddFunction,
	StepRemoveFunction,
	StepUpdateFunction,
} from '../TransformPage.types.js'

export function filter(
	steps: Step[],
	column: string,
	onAddStep: StepAddFunction,
	onUpdateStep: StepUpdateFunction,
	onRemoveStep: StepRemoveFunction,
): ICommandBarItemProps {
	return {
		key: 'fitler',
		text: 'Filter column',
		onRender: () => {
			return <BinCommand />
		},
	}
}

const BinCommand = (props: any) => {
	return (
		<IconButton title={'Filter column'} iconProps={{ iconName: 'Filter' }} />
	)
}
