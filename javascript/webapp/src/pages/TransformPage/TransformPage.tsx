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
import { memo, useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'

import { StepEditorCallout } from './StepEditorCallout.js'
import { TableDropdown } from './TableDropdown.js'
import {
	useColumnSelection,
	usePerColumnCommands,
	useResult,
	useSteps,
	useTableHeaderCommands,
	useTables,
} from './TransformPage.hooks.js'
import { createStep } from './TransformPage.utils.js'

/**
 * This is a page for testing out built-in table transform mechanisms
 */
export const TransformPage: React.FC = memo(function TransformPage() {
	const { tables, onUpdateTable, onCloneTable, current, onCurrentChange } =
		useTables()

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

	const [calloutTarget, setCalloutTarget] = useState<any>()

	// when the user clicks a new step button, we'll create a template to fill in
	// once they save this step is stored and the candidate disposed of
	// dismissing the interface without saving also disposed
	const [candidateStep, setCandidateStep] = useState<Step | undefined>()

	const handleStepRequested = useCallback(
		(e, verb, template) => {
			console.log('step requested', verb, template)
			setCalloutTarget(e.target.parentNode)
			setCandidateStep(prev => (prev ? undefined : createStep(verb, template)))
		},
		[setCalloutTarget, setCandidateStep],
	)

	const handleSave = useCallback(
		step => {
			setCandidateStep(undefined)
			onAddStep(step)
		},
		[setCandidateStep, onAddStep],
	)

	const handleCancel = useCallback(
		() => setCandidateStep(undefined),
		[setCandidateStep],
	)

	const headerCommands = useTableHeaderCommands(
		current,
		selectedColumn,
		steps,
		onCloneTable,
		handleStepRequested,
	)

	const handleTableChange = useCallback(
		(_e, opt) => {
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
			<StepEditorCallout
				target={calloutTarget}
				column={selectedColumn}
				input={result}
				store={store}
				step={candidateStep}
				onCancel={handleCancel}
				onSave={handleSave}
			/>
			<TableDropdown
				tables={tables}
				selectedKey={current?.id}
				onChange={handleTableChange}
			/>
			<Table>
				<ArqueroTableHeader
					table={result.table!}
					commands={headerCommands}
					name={current?.id}
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
