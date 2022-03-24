/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step, TableContainer } from '@data-wrangling-components/core'
import { useCallback, useMemo } from 'react'

import type {
	StepAddFunction,
	StepRemoveFunction,
	StepUpdateFunction,
} from '../TransformPage.types.js'
import { findById } from '../TransformPage.utils.js'

/**
 * Provides management functions for the definition steps on a table
 * @param table
 * @param onUpdateTable
 * @returns
 */
export function useSteps(
	table: TableContainer | undefined,
	onUpdateTable: (table: TableContainer) => void,
): {
	steps: Step[]
	onAddStep: StepAddFunction
	onUpdateStep: StepUpdateFunction
	onRemoveStep: StepRemoveFunction
} {
	const handleAddStep = useCallback(
		step => {
			if (table) {
				onUpdateTable({
					...table,
					definition: [...(table.definition || []), step],
				})
			}
		},
		[table, onUpdateTable],
	)
	const handleRemoveStep = useCallback(
		step => {
			if (table) {
				const steps = table.definition || []
				const found = findById(steps, step)
				const copy = [...steps]
				const splice = [...copy.slice(0, found), ...copy.slice(found + 1)]
				onUpdateTable({
					...table,
					definition: splice,
				})
			}
		},
		[table, onUpdateTable],
	)
	const handleUpdateStep = useCallback(
		(step, update) => {
			if (table) {
				const steps = table.definition || []
				const found = findById(steps, step)
				const copy = [...steps]
				copy[found] = update
				onUpdateTable({
					...table,
					definition: copy,
				})
			}
		},
		[table, onUpdateTable],
	)

	const steps = useMemo(() => table?.definition || [], [table])

	return {
		steps,
		onAddStep: handleAddStep,
		onUpdateStep: handleUpdateStep,
		onRemoveStep: handleRemoveStep,
	}
}
