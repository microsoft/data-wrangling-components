/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { escape } from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import type { RowObject } from 'arquero/dist/types/table/table'

import { columnType, MergeStrategy } from '../../index.js'
import type { DataType, MergeArgs } from '../../types.js'
import { makeStepFunction, makeStepNode, wrapColumnStep } from '../factories.js'

const doMerge = wrapColumnStep<MergeArgs>(
	(input, { columns = [], strategy, to, delimiter = '' }) => {
		const isSameDataTypeFlag: boolean = isSameDataType(input, columns)

		// eslint-disable-next-line
		const func: object = escape((d: any) => {
			switch (strategy) {
				case MergeStrategy.LastOneWins:
					return lastOneWinsStrategy(isSameDataTypeFlag, d, columns)
				case MergeStrategy.Concat:
					return concatStrategy(d, columns, delimiter)
				case MergeStrategy.CreateArray:
					return arrayStrategy(d, columns)
				case MergeStrategy.FirstOneWins:
				default:
					return firstOneWinsStrategy(isSameDataTypeFlag, d, columns)
			}
		})

		return input.derive({ [to]: func })
	},
)

export const merge = makeStepFunction(doMerge)
export const mergeNode = makeStepNode(doMerge)

function isSameDataType(inputTable: ColumnTable, columns: string[]): boolean {
	let allTypesAreTheSame = true
	const lastDataType: DataType = columnType(inputTable, columns[0]!)
	let i = 1

	while (allTypesAreTheSame === true && i < columns.length) {
		const dataType: DataType = columnType(inputTable, columns[i]!)
		allTypesAreTheSame = lastDataType === dataType
		i++
	}

	return allTypesAreTheSame
}

function firstOneWinsStrategy(
	isSameDataTypeFlag: boolean,
	singleRow: RowObject,
	columns: string[],
) {
	let firstValidValue: object = singleRow[columns[0]!]
	let foundFirstValidValue = false
	let i = 0

	while (!foundFirstValidValue && i < columns.length) {
		if (
			singleRow[columns[i]!] !== undefined &&
			singleRow[columns[i]!] !== null
		) {
			firstValidValue = singleRow[columns[i]!]
			foundFirstValidValue = true
		}
		i++
	}

	return isSameDataTypeFlag ? firstValidValue : '' + firstValidValue
}

function lastOneWinsStrategy(
	isSameDataTypeFlag: boolean,
	singleRow: RowObject,
	columns: string[],
) {
	let lastValidValue: object = singleRow[columns[0]!]

	for (let i = 0; i < columns.length; i++) {
		if (
			singleRow[columns[i]!] !== undefined &&
			singleRow[columns[i]!] !== null
		) {
			lastValidValue = singleRow[columns[i]!]
		}
	}

	return isSameDataTypeFlag ? lastValidValue : '' + lastValidValue
}

function arrayStrategy(singleRow: RowObject, columns: string[]) {
	const concat = []

	for (let i = 0; i < columns.length; i++) {
		if (
			singleRow[columns[i]!] !== undefined &&
			singleRow[columns[i]!] !== null
		) {
			concat.push(singleRow[columns[i]!])
		}
	}

	return concat
}

function concatStrategy(
	singleRow: RowObject,
	columns: string[],
	delimiter: string,
) {
	return arrayStrategy(singleRow, columns).join(delimiter)
}
