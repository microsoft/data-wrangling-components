/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type ColumnTable from 'arquero/dist/types/table/column-table'

import { container } from '../../container.js'
import type {
	SetOperationArgs,
	Step,
	TableContainer,
	TableStore,
} from '../../types.js'
import { SetOp } from '../../types.js'

/**
 * All of the arquero set verbs use the same args.
 * This util just simplifies executing them.
 * @param step
 * @param store
 * @param op
 * @returns
 */
export async function setWithStore(
	{ input, output, args: { others } }: Step<SetOperationArgs>,
	store: TableStore,
	op: SetOp,
): Promise<TableContainer> {
	const [inputTable, ...otherTables] = await Promise.all([
		store.get(input),
		...others.map(o => store.get(o)),
	])
	let result: ColumnTable | undefined
	if (inputTable.table) {
		result = set(
			inputTable.table,
			op,
			otherTables.map(o => o.table).filter(t => !!t) as ColumnTable[],
		)
	}
	return container(output, result)
}

export function set(
	input: ColumnTable,
	op: SetOp,
	others: ColumnTable[],
): ColumnTable {
	// arquero uses 'except' for the difference set operation, we need to map it
	const fn = op === SetOp.Difference ? 'except' : op
	return input[fn](...others)
}
