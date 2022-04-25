/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { RenameArgs,Step } from '@data-wrangling-components/core'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { useCallback } from 'react'

import type { StepChangeFunction } from '../../types.js'

export function useHandleColumnChange(
	step: Step<RenameArgs>,
	onChange?: StepChangeFunction<RenameArgs>,
): (previous: string, oldName: string, newName: string) => void {
	return useCallback(
		(previous, oldName, newName) => {
			const columns = {
				...step.args.columns,
			}
			// this is the previous column mapping - remove it in case we
			// selected a different one to rename
			delete columns[previous]
			columns[oldName] = newName
			onChange?.({
				...step,
				args: {
					...step.args,
					columns,
				},
			})
		},
		[step, onChange],
	)
}

// find the next column from the table to suggest
function next(step: Step<RenameArgs>, table?: ColumnTable): string | undefined {
	return table?.columnNames().find(name => {
		if (!step.args.columns) {
			return true
		}
		return !step.args.columns[name]
	})
}

export function useHandleAddButtonClick(
	step: Step<RenameArgs>,
	table?: ColumnTable,
	onChange?: StepChangeFunction<RenameArgs>,
): () => void {
	return useCallback(() => {
		const nextName = next(step, table)
		if (nextName) {
			onChange?.({
				...step,
				args: {
					...step.args,
					columns: {
						...step.args.columns,
						[nextName]: nextName,
					},
				},
			})
		}
	}, [step, table, onChange])
}

export function useDisabled(
	step: Step<RenameArgs>,
	table?: ColumnTable,
): boolean {
	if (!table) {
		return true
	}
	return (
		table.columnNames().length === Object.keys(step.args.columns || {}).length
	)
}
