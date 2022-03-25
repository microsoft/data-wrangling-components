/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TableContainer } from '@data-wrangling-components/core'
import { createTableStore, runPipeline } from '@data-wrangling-components/core'
import type { IColumn } from '@fluentui/react'
import { loadCSV } from 'arquero'
import { cloneDeep } from 'lodash'
import { useCallback, useEffect, useState } from 'react'

import { useInputTableList } from '../DebugPage/hooks.js'

export * from './hooks'

export function useTables(): {
	tables: TableContainer[]
	onUpdateTable: (table: TableContainer) => void
	onCloneTable: (table: TableContainer) => void
	current: TableContainer | undefined
	onCurrentChange: (table: TableContainer | undefined) => void
} {
	const [list] = useInputTableList()
	const [tables, setTables] = useState<TableContainer[]>([])
	const [current, setCurrent] = useState<TableContainer | undefined>()

	// just resolve all the input tables up front
	useEffect(() => {
		const store = createTableStore()
		list.forEach(name => {
			store.queue(name, async (name: string) =>
				loadCSV(name, { autoType: false }),
			)
		})
		Promise.all(list.map(name => store.get(name))).then(results => {
			setTables(results)
			setCurrent(results[0])
		})
	}, [list])

	const onUpdateTable = useCallback(
		(table: TableContainer) => {
			setTables(prev => {
				const index = prev.findIndex(t => t.id === table.id)
				const copy = [...prev]
				copy[index] = table
				return copy
			})
			setCurrent(table)
		},
		[setTables, setCurrent],
	)

	const onCloneTable = useCallback(
		async (original: TableContainer, name?: string) => {
			// apply the source table steps and store the resulting output
			// the cloned table starts "clean" with no definition steps
			const result = await applyTableDefinition(original, tables)
			const clone = {
				...cloneDeep(result),
				id: name || `${original?.id} (edited)`,
				definition: [],
			}
			setTables(prev => [...prev, clone])
			setCurrent(clone)
		},
		[tables, setTables, setCurrent],
	)

	return {
		tables,
		onUpdateTable,
		onCloneTable,
		current,
		onCurrentChange: setCurrent,
	}
}

/**
 * If the input exists and has a pipeline definition,
 * execute the definition and return the result,
 * otherwise return the input as is.
 * @param table
 * @param store
 * @returns
 */
export function useResult(
	current: TableContainer | undefined,
	tables: TableContainer[],
): TableContainer | undefined {
	const [result, setResult] = useState<TableContainer | undefined>()
	useEffect(() => {
		const f = async (table: TableContainer) => {
			const res = await applyTableDefinition(table, tables)
			setResult(res)
		}
		current && f(current)
	}, [current, tables, setResult])
	return result
}

async function applyTableDefinition(
	table: TableContainer,
	tables?: TableContainer[],
) {
	if (!table.definition || table.definition.length === 0) {
		return table
	}
	// create a private store just for the execution so we don't pollute the global
	const store = createTableStore()
	store.set(table)
	tables?.forEach(t => store.set(t))
	console.log(table.definition)
	const result = await runPipeline(table.table!, table.definition!, store)
	result.table!.print()
	return result
}

export function useColumnSelection(): {
	selectedColumn: string | undefined
	onColumnClick: any
	onColumnReset: any
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
	const onColumnReset = useCallback(
		() => setSelectedColumn(undefined),
		[setSelectedColumn],
	)
	return {
		selectedColumn,
		onColumnClick,
		onColumnReset,
	}
}
