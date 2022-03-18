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
				key: 'join',
				text: 'Join',
				iconProps: {
					iconName: 'Merge',
				},
				onClick: (ev: any) =>
					handleClick(ev, Verb.Join, {
						args: {
							on: column ? [column] : [],
						},
					}),
			},
		],
		[],
	)
}
