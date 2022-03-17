/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	OrderbyStep,
	Step,
	TableContainer,
	TableStore,
} from '@data-wrangling-components/core'
import { SortDirection, Verb } from '@data-wrangling-components/core'
import type { ICommandBarItemProps } from '@fluentui/react'
import { IconButton } from '@fluentui/react'

import type {
	StepAddFunction,
	StepRemoveFunction,
	StepUpdateFunction,
} from '../TransformPage.types.js'
import { createStep, findStep } from '../TransformPage.utils.js'

export function orderby(
	input: TableContainer | undefined,
	store: TableStore,
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
			}
			const step = findStep(steps, template) as OrderbyStep
			const entry = step?.args.orders.find(e => e.column === column)
			const order = entry?.direction
			const click = () => {
				if (!step) {
					onAddStep(
						createStep(Verb.Orderby, template, {
							args: {
								orders: [{ column, direction: SortDirection.Ascending }],
							},
						}),
					)
				} else {
					if (entry) {
						// check the direction to decide whether we flip it or remove it
						if (order === SortDirection.Ascending) {
							const index = step.args.orders.findIndex(e => e.column === column)
							const update = [...step.args.orders]
							update[index] = {
								column,
								direction: SortDirection.Descending,
							}
							onUpdateStep(step, {
								...step,
								args: {
									...step.args,
									orders: update,
								},
							})
						} else {
							// remove it
							const filtered = step.args.orders.filter(e => e.column !== column)
							if (filtered.length === 0) {
								onRemoveStep(step)
							} else {
								onUpdateStep(step, {
									...step,
									args: {
										...step.args,
										orders: filtered,
									},
								})
							}
						}
					} else {
						// brand new order
						onUpdateStep(step, {
							...step,
							args: {
								...step.args,
								orders: [
									...step.args.orders,
									{
										column,
										direction: SortDirection.Ascending,
									},
								],
							},
						})
					}
				}
			}

			const title =
				order === SortDirection.Ascending
					? `Order table descending by ${column}`
					: order === SortDirection.Descending
					? `Remove table order by ${column}`
					: `Order table ascending by ${column}`

			const icon =
				order === SortDirection.Ascending
					? `SortUp`
					: order === SortDirection.Descending
					? `sortDown`
					: `Sort`

			return (
				<IconButton
					title={title}
					checked={!!entry}
					iconProps={{ iconName: icon }}
					onClick={click}
				/>
			)
		},
	}
}
