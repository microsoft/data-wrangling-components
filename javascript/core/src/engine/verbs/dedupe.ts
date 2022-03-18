/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type ColumnTable from 'arquero/dist/types/table/column-table'

import { makeStepFunction, makeStepNode } from '../../factories.js'
import type { DedupeArgs } from '../../types.js'

export const dedupe = makeStepFunction(doDedupe)
export const dedupeNode = makeStepNode(doDedupe)

/**
 * Executes an arquero dedupe operation.
 * @param step
 * @param store
 * @returns
 */
function doDedupe(input: ColumnTable, { columns }: DedupeArgs) {
	return columns ? input.dedupe(columns) : input.dedupe()
}
