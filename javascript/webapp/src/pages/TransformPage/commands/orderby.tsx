/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { OrderbyStep, Step } from '@data-wrangling-components/core'
import { SortDirection, Verb } from '@data-wrangling-components/core'
import type { ICommandBarItemProps } from '@fluentui/react'
import { IconButton } from '@fluentui/react'
import { merge } from 'lodash'

import type {
	StepAddFunction,
	StepRemoveFunction,
	StepUpdateFunction,
} from '../TransformPage.types.js'
import { createStep, findStep } from '../TransformPage.utils.js'

export function orderby(
	steps: Step[],
	column: string,
	onAddStep: StepAddFunction,
	onUpdateStep: StepUpdateFunction,
	onRemoveStep: StepRemoveFunction,
): ICommandBarItemProps {
	return {
		key: 'orderby',
		text: 'Sort column',
		onRender: () => {
			const template = {
				verb: Verb.Orderby,
				args: {
					orders: [
						{
							column,
						},
					],
				},
			}
			const step = findStep(steps, template) as OrderbyStep
			const order = step?.args.orders[0].direction
			let icon = 'Sort'
			if (order === SortDirection.Ascending) {
				icon = 'SortUp'
			} else if (order === SortDirection.Descending) {
				icon = 'SortDown'
			}
			const click = () => {
				if (!step) {
					onAddStep(
						createStep(
							merge({}, template, {
								args: { orders: [{ direction: SortDirection.Ascending }] },
							}),
						),
					)
				} else if (order === SortDirection.Ascending) {
					onUpdateStep(step, {
						args: {
							orders: [
								{
									column: column,
									direction: SortDirection.Descending,
								},
							],
						},
					})
				} else {
					onRemoveStep(step)
				}
			}
			const title =
				order === SortDirection.Ascending
					? `Order table descending by ${column}`
					: order === SortDirection.Descending
					? `Remove table order by ${column}`
					: `Order table ascending by ${column}`
			return (
				<IconButton
					title={title}
					checked={!!step}
					iconProps={{ iconName: icon }}
					onClick={click}
				/>
			)
		},
	}
}
