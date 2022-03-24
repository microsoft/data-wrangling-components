/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { GroupbyStep, Step } from '@data-wrangling-components/core'
import { Verb } from '@data-wrangling-components/core'
import type { ICommandBarItemProps } from '@fluentui/react'
import { IconButton } from '@fluentui/react'

import type {
	StepAddFunction,
	StepRemoveFunction,
	StepUpdateFunction,
} from '../TransformPage.types.js'
import { createStep, findStep } from '../TransformPage.utils.js'

export function groupby(
	column: string,
	steps: Step[],
	onAddStep: StepAddFunction,
	onUpdateStep: StepUpdateFunction,
	onRemoveStep: StepRemoveFunction,
): ICommandBarItemProps {
	return {
		key: Verb.Groupby,
		text: 'Group by column',
		onRender: () => {
			const template = {
				verb: Verb.Groupby,
				args: {
					columns: [column],
				},
			}
			const step = findStep(steps, template) as GroupbyStep
			const entry = step?.args.columns.find(c => c === column)
			const click = () => {
				if (!step) {
					// first convert, add with the single column
					onAddStep(
						createStep(Verb.Groupby, template, {
							args: {
								columns: [column],
							},
						}),
					)
				} else {
					if (entry) {
						const updated = step.args.columns.filter(c => c !== column)
						if (updated.length === 0) {
							// last column - remove the step entirely
							onRemoveStep(step)
						} else {
							// otherwise pass the filtered list on
							onUpdateStep(step, {
								...step,
								args: {
									...step.args,
									columns: updated,
								},
							})
						}
					} else {
						// add this as a new column
						onUpdateStep(step, {
							...step,
							args: {
								...step.args,
								columns: [...step.args.columns, column],
							},
						})
					}
				}
			}
			return (
				<IconButton
					checked={!!entry}
					onClick={click}
					iconProps={{ iconName: 'GroupList' }}
				/>
			)
		},
	}
}
