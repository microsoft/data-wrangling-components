/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import ColumnTable from 'arquero/dist/types/table/column-table'
import { TableStore } from '../../index.js'
import { Step } from '../../types.js'

/**
 * Executes an arquero unorder.
 * @param step
 * @param store
 * @returns
 */
export async function unorder(
	step: Step,
	store: TableStore,
): Promise<ColumnTable> {
	const { input } = step
	const inputTable = await store.get(input)

	return inputTable.unorder()
}
