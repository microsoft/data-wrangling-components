/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step } from '@data-wrangling-components/core'
import { Verb } from '@data-wrangling-components/core'
import type { ICommandBarItemProps } from '@fluentui/react'
import { useCallback, useMemo } from 'react'

export function useHeaderTableCommands(
	column: string | undefined,
	onStepRequested: any,
): ICommandBarItemProps[] {
	const handleClick = useCallback(
		(ev: any, verb: Verb, template: Partial<Step>) => {
			onStepRequested(ev, verb, template)
		},
		[onStepRequested],
	)

	return useMemo(
		() => [
			{
				key: Verb.Join,
				text: 'Join',
				iconProps: {
					iconName: 'BranchMerge',
				},
				onClick: (ev: any) =>
					handleClick(ev, Verb.Join, {
						args: {
							on: column ? [column] : [],
						},
					}),
			},
			{
				key: Verb.Lookup,
				text: 'Lookup',
				iconProps: {
					iconName: 'BranchPullRequest',
				},
				onClick: (ev: any) =>
					handleClick(ev, Verb.Lookup, {
						args: {
							on: column ? [column] : [],
						},
					}),
			},
		],
		[column, handleClick],
	)
}
