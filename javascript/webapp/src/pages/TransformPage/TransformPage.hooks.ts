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
import { loadCSV } from 'arquero'
import { useCallback, useEffect, useMemo, useState } from 'react'

import type {
	StepAddFunction,
	StepRemoveFunction,
	StepUpdateFunction,
} from './TransformPage.types.js'
import { findById } from './TransformPage.utils.js'

export function useInputs(): {
	input: TableContainer | undefined
	store: TableStore
} {
	const input = useTable()
	const store = useMemo(() => createTableStore(), [])

	useEffect(() => {
		if (input) {
			store.set(input)
		}
	}, [input, store])

	return {
		input,
		store,
	}
}

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
	input: TableContainer | undefined,
	steps: Step[],
	store: TableStore,
): TableContainer | undefined {
	const [result, setResult] = useState<TableContainer | undefined>()
	useEffect(() => {
		const f = async () => {
			console.log(steps)
			const res = await runPipeline(input?.table!, steps, store)
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
