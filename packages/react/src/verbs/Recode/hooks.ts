/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { RecodeStep, RecodeArgs, Value } from '@data-wrangling-components/core'
import { op } from 'arquero'
import ColumnTable from 'arquero/dist/types/table/column-table'
import { useCallback, useMemo } from 'react'
import { StepChangeFunction } from '../../types'

export function useColumnValues(
	internal: RecodeStep,
	table?: ColumnTable,
): Value[] {
	return useMemo(() => {
		const { column } = internal.args
		if (!table || !column) {
			return []
		}
		const args = {
			[column]: op.array_agg_distinct(column),
		}
		return table.orderby(column).rollup(args).objects()[0][column] as Value[]
	}, [table, internal])
}

export function useHandleRecodeChange(
	internal: RecodeStep,
	onChange?: StepChangeFunction,
): (previous: Value, oldValue: Value, newValue: Value) => void {
	return useCallback(
		(previous, oldValue, newValue) => {
			const map = {
				...internal.args.map,
			}
			delete map[previous]
			map[oldValue] = newValue
			onChange &&
				onChange({
					...internal,
					args: {
						...internal.args,
						map,
					},
				})
		},
		[internal, onChange],
	)
}

export function useRecodeDelete(
	step: RecodeStep,
	onChange?: StepChangeFunction,
): (value: Value) => void {
	return useCallback(
		value => {
			const args = { ...step.args } as RecodeArgs
			delete args.map[value]
			onChange &&
				onChange({
					...step,
					args: {
						...step.args,
						...args,
					},
				})
		},
		[step, onChange],
	)
}

// find the next value from the table to suggest
function next(internal: RecodeStep, values: Value[]): Value | undefined {
	return values.find(value => {
		if (!internal.args.map) {
			return true
		}
		return internal.args.map[value] === undefined
	})
}

export function useHandleAddButtonClick(
	internal: RecodeStep,
	values: Value[],
	onChange?: StepChangeFunction,
): () => void {
	return useCallback(() => {
		const nextValue = next(internal, values)
		if (nextValue !== undefined) {
			// could be a 0 or false...
			onChange &&
				onChange({
					...internal,
					args: {
						...internal.args,
						map: {
							...internal.args.map,
							[nextValue]: nextValue,
						},
					},
				})
		}
	}, [internal, values, onChange])
}

export function useDisabled(internal: RecodeStep, values: Value[]): boolean {
	if (values.length === 0 || !internal.args.column) {
		return true
	}
	return values.length === Object.keys(internal.args.map || {}).length
}
