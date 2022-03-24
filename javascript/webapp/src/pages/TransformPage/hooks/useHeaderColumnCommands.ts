/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step } from '@data-wrangling-components/core'
import { Verb } from '@data-wrangling-components/core'
import type { ICommandBarItemProps, IContextualMenuItem } from '@fluentui/react'
import { upperFirst } from 'lodash'
import { useCallback, useMemo } from 'react'

export function useHeaderColumnCommands(
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
				Verb.Bin,
				column,
				{
					args: {
						column,
						to: column,
					},
				},
				handleClick,
				'ReportDocument',
			),
			createColumnCommand(
				Verb.Binarize,
				column,
				{
					args: {
						column,
						to: column,
					},
				},
				handleClick,
				'DistributeDown',
			),
			createColumnCommand(
				Verb.Filter,
				column,
				{
					args: {
						column,
					},
				},
				handleClick,
				'Filter',
			),
			createColumnCommand(
				Verb.Rollup,
				column,
				{
					args: {
						column,
					},
				},
				handleClick,
				'TableComputed',
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
