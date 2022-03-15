/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { container } from '../../factories.js'
import type { TableStore } from '../../index.js'
import type { FilterArgs, Step, TableContainer } from '../../types.js'
import { compareAll } from '../util/index.js'

/**
 * Executes an arquero filter.
 * @param step
 * @param store
 * @returns
 */
export async function filter(
	step: Step,
	store: TableStore,
): Promise<TableContainer> {
	const { input, output, args } = step
	const { column, criteria } = args as FilterArgs
	const inputTable = await store.table(input)

	const expr = compareAll(column, criteria)

	return container(output, inputTable.filter(expr))
}
