/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ConvertStep, Step } from '@data-wrangling-components/core'
import { ParseType, Verb } from '@data-wrangling-components/core'
import type { ICommandBarItemProps, IContextualMenuItem } from '@fluentui/react'
import { IconButton } from '@fluentui/react'
import { useCallback, useMemo } from 'react'

import { useSplitButtonStyles } from '../TransformPage.hooks.js'
import type {
	StepAddFunction,
	StepRemoveFunction,
	StepUpdateFunction,
} from '../TransformPage.types.js'
import { createStep, findStep } from '../TransformPage.utils.js'

export function convert(
	column: string,
	steps: Step[],
	onAddStep: StepAddFunction,
	onUpdateStep: StepUpdateFunction,
	onRemoveStep: StepRemoveFunction,
): ICommandBarItemProps {
	return {
		key: 'convert',
		text: 'Convert data type',
		onRender: () => {
			return (
				<Command
					column={column}
					steps={steps}
					onAddStep={onAddStep}
					onUpdateStep={onUpdateStep}
					onRemoveStep={onRemoveStep}
				/>
			)
		},
	}
}

const Command = (props: any) => {
	const { steps, column, onAddStep, onUpdateStep, onRemoveStep } = props
	const template = useMemo(
		() => ({
			verb: Verb.Convert,
			args: {
				columns: [column],
			},
		}),
		[column],
	)

	const step = useMemo(
		() => findStep(steps, template) as ConvertStep,
		[steps, template],
	)

	// at the top level we just create the default or toggle off
	const click = useCallback(() => {
		if (!step) {
			onAddStep(createStep(Verb.Convert, template))
		} else {
			onRemoveStep(step)
		}
	}, [step, template, onAddStep, onRemoveStep])

	const items = useMemo(
		() => [
			{
				key: ParseType.Decimal,
				text: 'Number',
				iconProps: {
					iconName: 'NumberSymbol',
				},
			},
			{
				key: ParseType.Date,
				text: 'Date',
				iconProps: {
					iconName: 'Calendar',
				},
			},
			{
				key: ParseType.Boolean,
				text: 'Boolean',
				iconProps: {
					iconName: 'CircleHalfFull',
				},
			},
		],
		[],
	)

	const iconName = useMemo(
		() =>
			items.find(i => i.key === step?.args.type)?.iconProps.iconName ||
			'NumberSymbol',
		[items, step],
	)
	const handleMenuClick = useCallback(
		(e: any, item: IContextualMenuItem | undefined) => {
			console.log(item)
			if (!step) {
				onAddStep(
					createStep(Verb.Convert, template, {
						args: {
							type: item?.key,
						},
					}),
				)
			} else {
				if (step.args.type === item?.key) {
					onRemoveStep(step)
				} else {
					onUpdateStep(step, {
						...step,
						args: {
							...step.args,
							type: item?.key,
						},
					})
				}
			}
		},
		[template, step, onAddStep, onUpdateStep, onRemoveStep],
	)
	const splitStyles = useSplitButtonStyles()
	return (
		<IconButton
			title={'Convert data type'}
			checked={!!step}
			iconProps={{ iconName }}
			onClick={click}
			split
			menuProps={{
				items,
				onItemClick: handleMenuClick,
			}}
			styles={splitStyles}
		/>
	)
}
