/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step } from '@data-wrangling-components/core'
import { BinStrategy, Verb } from '@data-wrangling-components/core'
import { Bin } from '@data-wrangling-components/react'
import type { ICommandBarItemProps } from '@fluentui/react'
import {
	Callout,
	DirectionalHint,
	IconButton,
	PrimaryButton,
} from '@fluentui/react'
import { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'

import type {
	StepAddFunction,
	StepRemoveFunction,
	StepUpdateFunction,
} from '../TransformPage.types.js'
import { createStep, findStep } from '../TransformPage.utils.js'

export function bin(
	steps: Step[],
	column: string,
	onAddStep: StepAddFunction,
	onUpdateStep: StepUpdateFunction,
	onRemoveStep: StepRemoveFunction,
): ICommandBarItemProps {
	return {
		key: 'bin',
		text: 'Bin column',
		onRender: () => {
			return (
				<BinCommand
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

const BinCommand = (props: any) => {
	const { steps, column, onAddStep, onUpdateStep, onRemoveStep } = props
	const [hidden, setHidden] = useState<boolean>(true)
	const handleClick = useCallback(() => setHidden(!hidden), [hidden, setHidden])

	const template = useMemo(
		() => ({
			verb: Verb.Bin,
			args: {
				column,
				to: column,
			},
		}),
		[column],
	)
	const step = useMemo(() => findStep(steps, template), [steps, template])
	const [internal, setInternal] = useState<Step>(
		step ||
			createStep(template, {
				args: {
					strategy: BinStrategy.Auto,
				},
			}),
	)

	const handleInternalChange = useCallback(
		s => {
			setInternal(s)
		},
		[setInternal],
	)

	const handleSaveClick = useCallback(() => {
		setHidden(true)
		if (step) {
			onUpdateStep(step, internal)
		} else {
			onAddStep(internal)
		}
	}, [step, onAddStep, onUpdateStep, internal])

	const handleDeleteClick = useCallback(() => {
		setHidden(true)
		setInternal(createStep(template))
		onRemoveStep(step)
	}, [step, onRemoveStep, template])

	return (
		<>
			<Callout
				target={'#bin' + column}
				hidden={hidden}
				directionalHint={DirectionalHint.bottomAutoEdge}
			>
				<Container>
					<Bin step={internal} onChange={handleInternalChange} />
					<Buttons>
						<PrimaryButton onClick={handleSaveClick}>Save</PrimaryButton>
						<IconButton
							title={'Delete step'}
							iconProps={{ iconName: 'Delete' }}
							onClick={handleDeleteClick}
						/>
					</Buttons>
				</Container>
			</Callout>
			<IconButton
				id={'bin' + column}
				title={'Bin column'}
				checked={!!step}
				iconProps={{ iconName: 'ReportDocument' }}
				onClick={handleClick}
			/>
		</>
	)
}

const Container = styled.div`
	padding: 8px;
`

const Buttons = styled.div`
	margin-top: 8px;
	display: flex;
	align-content: center;
	gap: 8px;
`
