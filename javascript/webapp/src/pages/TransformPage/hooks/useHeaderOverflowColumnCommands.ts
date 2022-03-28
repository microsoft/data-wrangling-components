/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step } from '@data-wrangling-components/core'
import { Verb } from '@data-wrangling-components/core'
import type { ICommandBarItemProps, IContextualMenuItem } from '@fluentui/react'
import { upperFirst } from 'lodash'
import { useCallback, useMemo } from 'react'

export function useHeaderOverflowColumnCommands(
	column: string | undefined,
	onStepRequested: any,
): ICommandBarItemProps[] {
	const handleClick = useCallback(
		(ev: any, verb: Verb, template: Partial<Step>) => {
			onStepRequested(ev, verb, template)
		},
		[onStepRequested],
	)

	const commands = useMemo(() => {
		return [
			createColumnCommand(
				Verb.Erase,
				column,
				{
					args: {
						column,
					},
				},
				handleClick,
				'EraseTool',
			),
			createColumnCommand(
				Verb.Fold,
				column,
				{
					args: {
						columns: [column],
					},
				},
				handleClick,
				'PivotChart',
			),
			createColumnCommand(
				Verb.Merge,
				column,
				{
					args: {
						column,
					},
				},
				handleClick,
				'MergeDuplicate',
			),
			createColumnCommand(
				Verb.Recode,
				column,
				{
					args: {
						column,
					},
				},
				handleClick,
				'Switch',
			),
		]
	}, [column, handleClick])

	return commands
}

function createColumnCommand(
	verb: Verb,
	column: string | undefined,
	template: Partial<Step>,
	onClick: any,
	icon: string,
): IContextualMenuItem {
	return {
		key: verb,
		text: upperFirst(verb),
		title: `${upperFirst(verb)} column ${column}`,
		disabled: !column,
		iconProps: { iconName: icon },
		onClick: (ev: any) => onClick(ev, verb, template),
	}
}
