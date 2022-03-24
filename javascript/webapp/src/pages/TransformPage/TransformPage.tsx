/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step } from '@data-wrangling-components/core'
import { createTableStore } from '@data-wrangling-components/core'
import {
	ArqueroDetailsList,
	ArqueroTableHeader,
	StatsColumnType,
} from '@data-wrangling-components/react'
import {
	Callout,
	ContextualMenuItemType,
	DirectionalHint,
	Dropdown,
} from '@fluentui/react'
import { memo, useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'

import { StepEditor } from './StepEditor.js'
import {
	useColumnSelection,
	useHeaderColumnCommands,
	useHeaderTableCommands,
	usePerColumnCommands,
	useResult,
	useSteps,
	useTables,
} from './TransformPage.hooks.js'
import { createStep } from './TransformPage.utils.js'

/**
 * This is a page for testing out built-in table transform mechanisms
 */
export const TransformPage: React.FC = memo(function PerfMage() {
	const {
		tables,
		// store,
		onUpdateTable,
		onCloneTable,
		current,
		onCurrentChange,
	} = useTables()

	const { steps, onAddStep, onUpdateStep, onRemoveStep } = useSteps(
		current,
		onUpdateTable,
	)

	const store = useMemo(() => createTableStore(tables), [tables])

	const result = useResult(current, tables)

	const columnCommands = usePerColumnCommands(
		steps,
		onAddStep,
		onUpdateStep,
		onRemoveStep,
	)

	const { selectedColumn, onColumnClick, onColumnReset } = useColumnSelection()

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

	const pinCommand = useMemo(() => {
		return {
			key: '--pinned--',
			title: 'Copy of this table in your workspace',
			iconOnly: true,
			disabled: steps.length === 0,
			iconProps: {
				iconName: 'Copy',
			},
			onClick: () => {
				onCloneTable(current!)
			},
		}
	}, [steps, current, onCloneTable])

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
				disabled: true,
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
				disabled: true,
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
			return `${current?.id} (edited)`
		}
		return current?.id
	}, [steps, current])

	const tableOptions = useMemo(() => {
		return (
			tables?.map(t => ({
				key: t.id,
				text: t.id,
			})) || []
		)
	}, [tables])

	const handleTableChange = useCallback(
		(e, opt) => {
			const found = tables?.find(t => t.id === opt.key)
			onCurrentChange(found)
			onColumnReset()
		},
		[tables, onCurrentChange, onColumnReset],
	)

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
			<Dropdown
				styles={{
					root: {
						width: 300,
					},
				}}
				options={tableOptions}
				selectedKey={current?.id}
				onChange={handleTableChange}
			/>
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
	padding: 10px 20px 0px 20px;
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
