/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step } from '@data-wrangling-components/core'
import {
	ArqueroDetailsList,
	ArqueroTableHeader,
	createDefaultCommandBar,
	StatsColumnType,
} from '@data-wrangling-components/react'
import {
	Callout,
	ContextualMenuItemType,
	DirectionalHint,
} from '@fluentui/react'
import { memo, useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'

import { convertNumber } from './commands/convertNumber.js'
import { groupby } from './commands/groupby.js'
import { orderby } from './commands/orderby.js'
import { StepEditor } from './StepEditor.js'
import {
	useColumnSelection,
	useHeaderColumnCommands,
	useHeaderTableCommands,
	useInputs,
	useResult,
	useSteps,
} from './TransformPage.hooks.js'
import { createStep } from './TransformPage.utils.js'

/**
 * This is a page for testing out built-in table transform mechanisms
 */
export const TransformPage: React.FC = memo(function PerfMage() {
	const { input, store } = useInputs()

	const { steps, onAddStep, onUpdateStep, onRemoveStep } = useSteps()

	const result = useResult(input, steps, store)

	const columnCommands = useMemo(() => {
		return (props: any) => {
			const column = props?.column.key
			return createDefaultCommandBar([
				convertNumber(
					result,
					store,
					steps,
					column,
					onAddStep,
					onUpdateStep,
					onRemoveStep,
				),
				groupby(
					result,
					store,
					steps,
					column,
					onAddStep,
					onUpdateStep,
					onRemoveStep,
				),
				orderby(
					result,
					store,
					steps,
					column,
					onAddStep,
					onUpdateStep,
					onRemoveStep,
				),
			])
		}
	}, [result, store, steps, onAddStep, onRemoveStep, onUpdateStep])

	const { selectedColumn, onColumnClick } = useColumnSelection()

	const [calloutHidden, setCalloutHidden] = useState<boolean>(true)
	const [calloutTarget, setCalloutTarget] = useState<any>()
	const [candidateStep, setCandidateStep] = useState<Step | undefined>()

	const handleDismiss = useCallback(
		() => setCalloutHidden(true),
		[setCalloutHidden],
	)
	const handleStepRequested = useCallback(
		(ev, verb, template) => {
			console.log('step requested', verb, template)
			setCalloutHidden(prev => !prev)
			setCalloutTarget(ev)
			setCandidateStep(createStep(verb, template))
		},
		[setCalloutHidden, setCalloutTarget, setCandidateStep],
	)

	const handleSave = useCallback(
		step => {
			setCalloutHidden(true)
			onAddStep(step)
		},
		[setCalloutHidden, onAddStep],
	)

	const [saved, setSaved] = useState<boolean>(false)
	const pinCommand = useMemo(
		() => ({
			key: '--pinned--',
			title: 'Pin a copy of this table to your workspace',
			iconOnly: true,
			disabled: steps.length === 0,
			iconProps: {
				iconName: saved ? 'Pinned' : 'Pin',
			},
			onClick: () => {
				setSaved(prev => !prev)
				store.set({
					...result,
					id: `${input?.id} (edited)`,
				})
			},
		}),
		[steps, result, saved, input, store],
	)

	const headerColumnCommands = useHeaderColumnCommands(
		selectedColumn,
		handleStepRequested,
	)

	const headerTableCommands = useHeaderTableCommands(
		selectedColumn,
		handleStepRequested,
	)

	const headerCommands = useMemo(
		() => [
			pinCommand,
			{
				key: '--divider-1--',
				text: '|',
				itemType: ContextualMenuItemType.Divider,
				buttonStyles: {
					root: {
						width: 20,
						minWidth: 20,
					},
				},
			},
			...headerColumnCommands,
			{
				key: '--divider-2--',
				text: '|',
				itemType: ContextualMenuItemType.Divider,
				buttonStyles: {
					root: {
						width: 20,
						minWidth: 20,
					},
				},
			},
			...headerTableCommands,
		],
		[pinCommand, headerColumnCommands, headerTableCommands],
	)

	const name = useMemo(() => {
		if (steps.length > 0) {
			return `${input?.id} (edited)`
		}
		return input?.id
	}, [steps, input])

	if (!result) {
		return null
	}

	return (
		<Container>
			<Callout
				target={calloutTarget}
				directionalHint={DirectionalHint.bottomAutoEdge}
				styles={calloutStyles}
				hidden={calloutHidden}
			>
				<StepEditor
					column={selectedColumn}
					input={result}
					store={store}
					step={candidateStep}
					onDismiss={handleDismiss}
					onAddStep={handleSave}
				/>
			</Callout>
			<Table>
				<ArqueroTableHeader
					table={result.table!}
					commands={headerCommands}
					name={name}
				/>
				<ArqueroDetailsList
					table={result.table!}
					isHeadersFixed
					isColumnClickable
					selectedColumn={selectedColumn}
					onColumnClick={onColumnClick}
					features={{
						statsColumnHeaders: true,
						statsColumnTypes: [
							StatsColumnType.Type,
							StatsColumnType.Count,
							StatsColumnType.Distinct,
							StatsColumnType.Invalid,
							StatsColumnType.Min,
							StatsColumnType.Max,
							StatsColumnType.Mean,
						],
						commandBar: [columnCommands],
						histogramColumnHeaders: true,
					}}
				/>
			</Table>
		</Container>
	)
})

const Container = styled.div`
	padding: 0px 20px 0px 20px;
`

const Table = styled.div`
	margin-top: 12px;
	width: 1200px;
	height: 800px;
`

const calloutStyles = {
	root: {
		width: 360,
		maxHeight: 800,
	},
}
