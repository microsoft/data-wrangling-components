/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type ColumnTable from 'arquero/dist/types/table/column-table'

import type { GroupbyArgs } from '../../types.js'
import { makeStepFunction, makeStepNode } from '../factories.js'

export const groupby = makeStepFunction(doGroupby)
export const groupbyNode = makeStepNode(doGroupby)

function doGroupby(input: ColumnTable, { columns }: GroupbyArgs) {
	return input.groupby(columns)
}
