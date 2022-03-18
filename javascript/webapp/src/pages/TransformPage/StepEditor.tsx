/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	Step,
	TableContainer,
	TableStore,
} from '@data-wrangling-components/core'
import { selectStepComponent } from '@data-wrangling-components/react'
import { IconButton, PrimaryButton } from '@fluentui/react'
import { upperFirst } from 'lodash'
import { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'

export interface StepEditorProps {
	column?: string
	input: TableContainer
	store: TableStore
	step?: Step
	onDismiss: () => void
	onAddStep: (step: Step) => void
}

export const StepEditor: React.FC<StepEditorProps> = (props: any) => {
	const { column, input, store, step, onAddStep, onDismiss } = props

	if (!step) {
		return null
	}

	return (
		<Editor
			column={column}
			input={input}
			store={store}
			step={step}
			onDismiss={onDismiss}
			onAddStep={onAddStep}
		/>
	)
}

const Editor = (props: any) => {
	const { column, input, store, step, onAddStep, onDismiss } = props
	const [internal, setInternal] = useState<Step>(step)

	useEffect(() => {
		setInternal(step)
	}, [step])
	console.log(step, internal)

	const handleSaveClick = useCallback(() => {
		onAddStep(internal)
	}, [internal, onAddStep])

	const handleChange = useCallback(update => setInternal(update), [setInternal])

	const Component = useMemo(
		() => (internal ? selectStepComponent(internal) : Empty),
		[internal],
	)

	if (!internal) {
		return null
	}

	return (
		<Container>
			<Header>
				<Title>
					{upperFirst(step.verb)}
					<ColumnName>{column}</ColumnName>column
				</Title>
				<IconButton
					onClick={onDismiss}
					iconProps={{
						iconName: 'Cancel',
					}}
				/>
			</Header>
			<ComponentContainer>
				<Component
					table={input.table}
					store={store}
					step={internal}
					onChange={handleChange}
				/>
				<Buttons>
					<PrimaryButton onClick={handleSaveClick}>Save</PrimaryButton>
				</Buttons>
			</ComponentContainer>
		</Container>
	)
}

const Empty = () => <></>

const Container = styled.div`
	padding: 0;
`

const Header = styled.div`
	display: flex;
	width: 100%;
	justify-content: space-between;
	background: ${({ theme }) => theme.application().faint().hex()};
`

const Title = styled.h3`
	display: flex;
	margin: 0;
	padding: 8px;
	font-size: 0.9em;
	color: ${({ theme }) => theme.application().midHighContrast().hex()};
`

const ColumnName = styled.div`
	margin-left: 4px;
	margin-right: 4px;
	color: ${({ theme }) => theme.application().accent().hex()};
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
