/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import ColumnTable from 'arquero/dist/types/table/column-table'
import { TableStore } from '../../index.js'
import { GroupbyArgs, Step } from '../../types.js'

/**
 * Executes an arquero groupby operation.
 * @param step
 * @param store
 * @returns
 */
export async function groupby(
	step: Step,
	store: TableStore,
): Promise<ColumnTable> {
	const { input, args } = step
	const { columns } = args as GroupbyArgs
	const inputTable = await store.get(input)
	return inputTable.groupby(columns)
}
