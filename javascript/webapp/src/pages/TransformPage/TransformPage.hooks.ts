/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	Step,
	TableContainer,
	TableStore,
} from '@data-wrangling-components/core'
import { createTableStore, runPipeline } from '@data-wrangling-components/core'
import type { IColumn } from '@fluentui/react'
import { loadCSV } from 'arquero'
import { useCallback, useEffect, useMemo, useState } from 'react'

import type {
	StepAddFunction,
	StepRemoveFunction,
	StepUpdateFunction,
} from './TransformPage.types.js'
import { findById } from './TransformPage.utils.js'

export * from './hooks'

export function useInputs(): {
	input: TableContainer | undefined
	store: TableStore
} {
	const input = useTable('data/companies.csv')
	const other = useTable('data/products.csv')

	const store = useMemo(() => createTableStore(), [])

	useEffect(() => {
		if (input) {
			store.set(input)
		}
		if (other) {
			store.set(other)
		}
	}, [input, other, store])

	return {
		input,
		store,
	}
}

export function useTable(path: string): TableContainer | undefined {
	const [table, setTable] = useState<TableContainer | undefined>()
	useEffect(() => {
		const f = async () => {
			const root = await loadCSV(path, {
				autoType: false,
			})
			setTable({
				id: path,
				table: root,
			})
		}
		void f()
	}, [path])
	return table
}

export function useResult(
	input: TableContainer | undefined,
	steps: Step[],
	store: TableStore,
): TableContainer | undefined {
	const [result, setResult] = useState<TableContainer | undefined>()
	useEffect(() => {
		const f = async () => {
			console.log(steps)
			const res = await runPipeline(input!.table!, steps, store)
			res.table?.print()
			setResult(res)
		}
		if (input) {
			if (steps.length > 0) {
				f()
			} else {
				setResult(input)
			}
		}
	}, [input, store, steps, setResult])
	return result
}

export function useSteps(): {
	steps: Step[]
	onAddStep: StepAddFunction
	onUpdateStep: StepUpdateFunction
	onRemoveStep: StepRemoveFunction
} {
	const [steps, setSteps] = useState<Step[]>([])

	const handleAddStep = useCallback(
		step => {
			setSteps(prev => [...prev, step])
		},
		[setSteps],
	)
	const handleRemoveStep = useCallback(
		step => {
			setSteps(prev => {
				const found = findById(prev, step)
				const copy = [...prev]
				const splice = [...copy.slice(0, found), ...copy.slice(found + 1)]
				return splice
			})
		},
		[setSteps],
	)
	const handleUpdateStep = useCallback(
		(step, update) => {
			setSteps(prev => {
				const found = findById(prev, step)
				const copy = [...prev]
				copy[found] = update
				return copy
			})
		},
		[setSteps],
	)

	return {
		steps,
		onAddStep: handleAddStep,
		onUpdateStep: handleUpdateStep,
		onRemoveStep: handleRemoveStep,
	}
}

export function useColumnSelection(): {
	selectedColumn: string | undefined
	onColumnClick: any
} {
	const [selectedColumn, setSelectedColumn] = useState<string | undefined>()
	const onColumnClick = useCallback(
		(e?: any, column?: IColumn) => {
			setSelectedColumn(prev =>
				prev === column?.key ? undefined : column?.key,
			)
		},
		[setSelectedColumn],
	)
	return {
		selectedColumn,
		onColumnClick,
	}
}
