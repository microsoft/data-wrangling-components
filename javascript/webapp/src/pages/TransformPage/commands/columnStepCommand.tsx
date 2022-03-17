/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	Step,
	TableContainer,
	TableStore,
	Verb,
} from '@data-wrangling-components/core'
import { selectStepComponent } from '@data-wrangling-components/react'
import type { IButtonProps, ICommandBarItemProps } from '@fluentui/react'
import {
	Callout,
	DirectionalHint,
	IconButton,
	PrimaryButton,
} from '@fluentui/react'
import { upperFirst } from 'lodash'
import { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'

import type {
	StepAddFunction,
	StepRemoveFunction,
	StepUpdateFunction,
} from '../TransformPage.types.js'
import { createStep, findStep } from '../TransformPage.utils.js'

export function columnStepCommand(
	input: TableContainer | undefined,
	store: TableStore,
	verb: Verb,
	steps: Step[],
	column: string,
	onAddStep: StepAddFunction,
	onUpdateStep: StepUpdateFunction,
	onRemoveStep: StepRemoveFunction,
	buttonProps: IButtonProps,
): ICommandBarItemProps {
	return {
		key: verb,
		text: verb,
		onRender: () => {
			return (
				<Command
					input={input}
					store={store}
					verb={verb}
					column={column}
					steps={steps}
					onAddStep={onAddStep}
					onUpdateStep={onUpdateStep}
					onRemoveStep={onRemoveStep}
					buttonProps={buttonProps}
				/>
			)
		},
	}
}

const Command = (props: any) => {
	const {
		input,
		store,
		verb,
		steps,
		column,
		onAddStep,
		onUpdateStep,
		onRemoveStep,
		buttonProps,
	} = props
	const [hidden, setHidden] = useState<boolean>(true)
	const handleClick = useCallback(() => setHidden(!hidden), [hidden, setHidden])

	const template = useMemo(
		() => ({
			verb,
			args: {
				column,
				to: column,
			},
		}),
		[verb, column],
	)
	const step = useMemo(() => findStep(steps, template), [steps, template])
	const [internal, setInternal] = useState<Step>(
		step || createStep(verb, template),
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
		setInternal(createStep(verb, template))
		onRemoveStep(step)
	}, [verb, step, onRemoveStep, template])
	const Component = useMemo(() => selectStepComponent(internal), [internal])
	return (
		<>
			<Callout
				target={`.${verb}-${column}`}
				hidden={hidden}
				directionalHint={DirectionalHint.bottomCenter}
				styles={calloutStyles}
			>
				<Container>
					<Title>{upperFirst(verb)}</Title>
					<ComponentContainer>
						<Component
							table={input.table}
							store={store}
							step={internal}
							onChange={handleInternalChange}
						/>
						<Buttons>
							<PrimaryButton onClick={handleSaveClick}>Save</PrimaryButton>
							{step ? (
								<IconButton
									title={'Delete step'}
									iconProps={{ iconName: 'Delete' }}
									onClick={handleDeleteClick}
								/>
							) : null}
						</Buttons>
					</ComponentContainer>
				</Container>
			</Callout>
			<IconButton
				className={`${verb}-${column}`}
				checked={!!step}
				onClick={handleClick}
				{...buttonProps}
			/>
		</>
	)
}

const Container = styled.div`
	padding: 0;
`

const Title = styled.h3`
	margin: 0;
	padding: 8px;
	background: ${({ theme }) => theme.application().faint().hex()};
	color: ${({ theme }) => theme.application().midHighContrast().hex()};
`

const ComponentContainer = styled.div`
	padding: 8px;
`

const Buttons = styled.div`
	margin-top: 8px;
	display: flex;
	align-content: center;
	gap: 8px;
`

const calloutStyles = {
	root: {
		width: 360,
		maxHeight: 800,
	},
}
