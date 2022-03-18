/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { escape } from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import type { ExprObject } from 'arquero/dist/types/table/transformable'

import type { DeriveArgs } from '../../types.js'
import { MathOperator } from '../../types.js'
import { makeStepFunction, makeStepNode } from '../factories.js'

export const derive = makeStepFunction(doDerive)
export const deriveNode = makeStepNode(doDerive)

/**
 * Executes an arquero derive.
 * This basically just supports math operations between two columns.
 */
function doDerive(
	input: ColumnTable,
	{ column1, column2, operator, to }: DeriveArgs,
) {
	// eslint-disable-next-line
	const func = escape((d: any) => {
		const l = d[column1]
		const r = d[column2]
		switch (operator) {
			case MathOperator.Add:
				return l + r
			case MathOperator.Subtract:
				return l - r
			case MathOperator.Multiply:
				return l * r
			case MathOperator.Divide:
				return l / r
			default:
				throw new Error(`Unsupported operator: [${operator}]`)
		}
	})

	const dArgs: ExprObject = {
		[to]: func,
	}
	return input.derive(dArgs)
}
