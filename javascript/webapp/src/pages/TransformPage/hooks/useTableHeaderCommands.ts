/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step, TableContainer } from '@data-wrangling-components/core'
import { createDefaultHeaderCommandBar } from '@data-wrangling-components/react'
import type { ICommandBarProps } from '@fluentui/react'
import { ContextualMenuItemType } from '@fluentui/react'
import { useThematic } from '@thematic/react'
import type { ReactElement } from 'react'
import { useMemo } from 'react'

import { useHeaderColumnCommands } from './useHeaderColumnCommands.js'
import { useHeaderOverflowColumnCommands } from './useHeaderOverflowColumnCommands.js'
import { useHeaderTableCommands } from './useHeaderTableCommands.js'
import { useSaveTableCommand } from './useSaveTableCommand.js'

export function useTableHeaderCommands(
	table: TableContainer | undefined,
	column: string | undefined,
	steps: Step[],
	onCloneTable: any,
	onStepRequested: any,
): ReactElement<ICommandBarProps, any> {
	const pinCommand = useSaveTableCommand(steps, table, onCloneTable)

	const headerColumnCommands = useHeaderColumnCommands(column, onStepRequested)

	const headerTableCommands = useHeaderTableCommands(column, onStepRequested)

	const headerOverflowColumnCommands = useHeaderOverflowColumnCommands(
		column,
		onStepRequested,
	)

	const theme = useThematic()
	return useMemo(
		() =>
			createDefaultHeaderCommandBar(
				{
					items: [
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
					overflowItems: headerOverflowColumnCommands,
				},
				theme,
			),
		[
			theme,
			pinCommand,
			headerColumnCommands,
			headerTableCommands,
			headerOverflowColumnCommands,
		],
	)
}
