/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	Step,
	TableContainer,
	TableMetadata,
	TableStore,
} from '@data-wrangling-components/core'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { useEffect, useMemo, useState } from 'react'

import { usePipeline, useStore } from '../../common/index.js'
import {
	getLoadingOrchestrator,
	LoadingOrchestratorType,
} from '../../Orchestrator/index.js'
import {
	useAddNewTables,
	useOnDeleteStep,
	useOnSaveStep,
	useOnUpdateMetadata,
	useRunPipeline,
} from '../hooks/index.js'

export function useBusinessLogic(
	tables: TableContainer[],
	onUpdateSteps: (steps: Step[]) => void,
	steps?: Step[],
	onOutputTable?: (table: TableContainer) => void,
): {
	selectedTable: ColumnTable | undefined
	setSelectedTableName: (name: string) => void
	onDeleteStep: (index: number) => void
	onSaveStep: (step: Step, index?: number) => void
	store: TableStore
	selectedMetadata: TableMetadata | undefined
	lastTableName: string
	selectedTableName?: string
	derived: TableContainer[]
	onUpdateMetadata: (meta: TableMetadata) => void
	tablesLoading: boolean
} {
	const [selectedTableName, setSelectedTableName] = useState<string>()
	const [storedTables, setStoredTables] = useState<Map<string, TableContainer>>(
		new Map<string, TableContainer>(),
	)

	const store = useStore()
	const pipeline = usePipeline(store)
	const runPipeline = useRunPipeline(
		pipeline,
		setStoredTables,
		setSelectedTableName,
	)
	const addNewTables = useAddNewTables(store, setStoredTables)
	const { isLoading } = getLoadingOrchestrator(LoadingOrchestratorType.Tables)

	// TODO: resolve these from the stored table state
	const derived = useMemo(() => {
		const unique = new Set<string>()
		steps?.forEach(step => unique.add(step.output))
		return Array.from(unique).map(name => ({
			id: name,
		}))
	}, [steps])

	const selectedTable = useMemo((): ColumnTable | undefined => {
		return storedTables.get(selectedTableName ?? '')?.table
	}, [selectedTableName, storedTables])

	const selectedMetadata = useMemo((): TableMetadata | undefined => {
		return storedTables.get(selectedTableName ?? '')?.metadata
	}, [storedTables, selectedTableName])

	// kind of a complex selection process:
	// 1) if a table is selected in the tables dropdown, use that
	// 2) if there are derived tables, use the last one
	// 3) if the store tables do not have any derived, use the first input
	const lastTableName = useMemo((): string => {
		if (selectedTableName) {
			return selectedTableName
		}
		if (derived && derived.length > 0) {
			const last = derived[derived.length - 1]
			if (last) {
				return last.id
			}
		}
		return tables[0]?.id || ''
	}, [tables, selectedTableName, derived])

	useEffect(() => {
		if (tables.length) {
			addNewTables(tables)
			const last = tables[tables.length - 1]
			setSelectedTableName(last?.id)
		}
	}, [tables, addNewTables, setSelectedTableName])

	useEffect(() => {
		if (lastTableName && onOutputTable) {
			const table = storedTables.get(lastTableName)
			if (table) {
				onOutputTable(table)
			}
		}
	}, [storedTables, lastTableName, onOutputTable])

	useEffect(() => {
		if (storedTables.size > 0) {
			if (
				steps?.filter(s => !pipeline.steps?.includes(s)).length ||
				steps?.length !== pipeline.steps.length
			) {
				pipeline.clear()
				steps && pipeline.addAll(steps)
				runPipeline()
			}
		}
	}, [steps, pipeline, runPipeline, storedTables])

	const onSaveStep = useOnSaveStep(onUpdateSteps, steps)
	const onDeleteStep = useOnDeleteStep(onUpdateSteps, steps)

	const onUpdateMetadata = useOnUpdateMetadata(
		setStoredTables,
		store,
		selectedTableName,
	)

	return {
		selectedTable,
		setSelectedTableName,
		onDeleteStep,
		onSaveStep,
		store,
		selectedMetadata,
		lastTableName,
		selectedTableName,
		derived,
		onUpdateMetadata,
		tablesLoading: isLoading,
	}
}
