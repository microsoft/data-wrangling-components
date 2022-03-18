/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { escape, op } from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table'

import type { ConvertArgs } from '../../types.js'
import { ParseType } from '../../types.js'
import { makeStepFunction, makeStepNode } from '../factories.js'

export const convert = makeStepFunction(doConvert)
export const convertNode = makeStepNode(doConvert)

/**
 * Executes an arquero string parse operation.
 */
function doConvert(table: ColumnTable, { columns, type, radix }: ConvertArgs) {
	// note that this applies the specified parse to every column equally
	const dArgs = columns.reduce((acc, cur) => {
		acc[cur] = parseType(cur, type, radix)
		return acc
	}, {} as any)
	return table.derive(dArgs)
}

function parseType(column: string, type: ParseType, radix?: number) {
	return escape((d: any) => {
		const value = d[column]
		switch (type) {
			case ParseType.Boolean:
				// arquero has no boolean operation
				// note that any string, even 'false' becomes true with the boolean constructor
				// that's not likely the right way to interpret data table content, however
				if (value === 'false') {
					return false
					// for all other intents and purposes, a truthy value should be coerced
				} else if (value) {
					return true
				}
				return false
			case ParseType.Date:
				return op.parse_date(value)
			case ParseType.Integer:
				return op.parse_int(value, radix)
			case ParseType.Decimal:
				return op.parse_float(value)
		}
	})
}
