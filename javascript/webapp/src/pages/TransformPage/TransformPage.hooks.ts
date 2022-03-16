/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step, TableContainer } from '@data-wrangling-components/core'
import { runPipeline } from '@data-wrangling-components/core'
import { loadCSV } from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { useCallback, useEffect, useState } from 'react'

import type {
	StepAddFunction,
	StepRemoveFunction,
	StepUpdateFunction,
} from './TransformPage.types.js'
import { findById } from './TransformPage.utils.js'

export function useTable(): TableContainer | undefined {
	const [table, setTable] = useState<TableContainer | undefined>()
	useEffect(() => {
		const f = async () => {
			const root = await loadCSV('data/stocks.csv', {
				autoType: false,
			})
			setTable({
				id: 'data/stocks.csv',
				table: root,
			})
		}
		void f()
	}, [])
	return table
}

export function useResult(
	table: TableContainer | undefined,
	steps: Step[],
): ColumnTable | undefined {
	const [result, setResult] = useState<ColumnTable | undefined>()
	useEffect(() => {
		const f = async () => {
			console.log(steps)
			const res = await runPipeline(table!.table!, steps)
			res.table?.print()
			setResult(res.table)
		}
		if (table) {
			if (steps.length > 0) {
				f()
			} else {
				setResult(table.table)
			}
		}
	}, [table, steps, setResult])
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
