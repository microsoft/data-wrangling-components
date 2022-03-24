/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step, TableContainer } from '@data-wrangling-components/core'
import { ContextualMenuItemType } from '@fluentui/react'
import { useMemo } from 'react'

import { useHeaderColumnCommands } from './useHeaderColumnCommands.js'
import { useHeaderTableCommands } from './useHeaderTableCommands.js'

export function useTableHeaderCommands(
	table: TableContainer | undefined,
	column: string | undefined,
	steps: Step[],
	onCloneTable: any,
	onStepRequested: any,
) {
	const pinCommand = useMemo(() => {
		return {
			key: '--pinned--',
			title: 'Copy of this table in your workspace',
			iconOnly: true,
			disabled: steps.length === 0,
			iconProps: {
				iconName: 'Copy',
			},
			onClick: () => {
				onCloneTable(table!)
			},
		}
	}, [steps, table, onCloneTable])

	const headerColumnCommands = useHeaderColumnCommands(column, onStepRequested)

	const headerTableCommands = useHeaderTableCommands(column, onStepRequested)

	return useMemo(
		() => [
			pinCommand,
			{
				key: '--divider-1--',
				text: '|',
				itemType: ContextualMenuItemType.Divider,
				disabled: true,
				buttonStyles: {
					root: {
						width: 20,
						minWidth: 20,
					},
				},
			},
			...headerColumnCommands,
			{
				key: '--divider-2--',
				text: '|',
				itemType: ContextualMenuItemType.Divider,
				disabled: true,
				buttonStyles: {
					root: {
						width: 20,
						minWidth: 20,
					},
				},
			},
			...headerTableCommands,
		],
		[pinCommand, headerColumnCommands, headerTableCommands],
	)
}
