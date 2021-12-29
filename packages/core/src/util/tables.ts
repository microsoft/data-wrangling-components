/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { op } from 'arquero'
import ColumnTable from 'arquero/dist/types/table/column-table'
import { isDate, isArray } from 'lodash'
import { Bin, ColumnMetadata, ColumnStats, TableMetadata } from '..'
import { fixedBinCount } from '../engine/util'

// arquero uses 1000 as default, but we're sampling the table so assuming higher odds of valid values
const SAMPLE_MAX = 100

/**
 * Performs type inference and stats on a table/columns.
 * @param table
 * @param detailed - include detailed per-column stats, otherwise just basic types
 * @returns
 */
export function introspect(
	table: ColumnTable,
	detailed = false,
): TableMetadata {
	const columns = detailed ? detailedMeta(table) : basicMeta(table)
	return {
		rows: table.numRows(),
		cols: table.numCols(),
		columns,
	}
}

function detailedMeta(table: ColumnTable): Record<string, ColumnMetadata> {
	const s = stats(table)
	return table.columnNames().reduce((acc, cur) => {
		acc[cur] = {
			name: cur,
			type: s[cur].type,
			stats: s[cur],
		}
		return acc
	}, {} as Record<string, ColumnMetadata>)
}

function basicMeta(table: ColumnTable): Record<string, ColumnMetadata> {
	const t = types(table)
	return table.columnNames().reduce((acc, cur) => {
		acc[cur] = {
			name: cur,
			type: t[cur],
		}
		return acc
	}, {} as Record<string, ColumnMetadata>)
}

/**
 * Generates detailed column stats for a table.
 * @param table
 * @returns
 */
export function stats(table: ColumnTable): Record<string, ColumnStats> {
	const reqStats = requiredStats(table)
	const optStats = optionalStats(table)
	const bins = binning(table, reqStats, optStats)
	const results = table.columnNames().reduce((acc, cur) => {
		// mode should only include valid values, so a reasonable value for checking type
		const mode = reqStats[`${cur}.mode`]
		const type = determineType(mode)
		const req = {
			type,
			count: reqStats[`${cur}.count`],
			distinct: reqStats[`${cur}.distinct`],
			invalid: reqStats[`${cur}.invalid`],
			mode,
		}
		const opt =
			type === 'number'
				? {
						min: optStats[`${cur}.min`],
						max: optStats[`${cur}.max`],
						mean: optStats[`${cur}.mean`],
						median: optStats[`${cur}.median`],
						stdev: optStats[`${cur}.stdev`],
						bins: bins[`${cur}.bins`],
				  }
				: {}
		acc[cur] = {
			...req,
			...opt,
		}
		return acc
	}, {} as Record<string, ColumnStats>)
	return results
}

function requiredStats(table: ColumnTable): Record<string, any> {
	const args = table.columnNames().reduce((acc, cur) => {
		acc[`${cur}.count`] = op.count()
		acc[`${cur}.distinct`] = op.distinct(cur)
		acc[`${cur}.invalid`] = op.invalid(cur)
		acc[`${cur}.mode`] = op.mode(cur)
		return acc
	}, {} as Record<string, any>)
	return table.rollup(args).objects()[0]
}

function optionalStats(table: ColumnTable): Record<string, any> {
	const args = table.columnNames().reduce((acc, cur) => {
		acc[`${cur}.min`] = op.min(cur)
		acc[`${cur}.max`] = op.max(cur)
		acc[`${cur}.mean`] = op.mean(cur)
		acc[`${cur}.median`] = op.median(cur)
		acc[`${cur}.stdev`] = op.stdev(cur)
		return acc
	}, {} as Record<string, any>)
	return table.rollup(args).objects()[0]
}

function binning(
	table: ColumnTable,
	reqStats: Record<string, any>,
	optStats: Record<string, any>,
) {
	const numeric = table.columnNames(name => {
		const mode = reqStats[`${name}.mode`]
		const type = determineType(mode)
		return type === 'number'
	})
	const binArgs = numeric.reduce((acc, cur) => {
		const min = optStats[`${cur}.min`]
		// note the slight over on max to avoid arquero binning into exclusive max
		const max = optStats[`${cur}.max`] + 1e-6
		acc[cur] = fixedBinCount(cur, min, max, 10)
		return acc
	}, {} as Record<string, any>)

	const binRollup = table.select(numeric).derive(binArgs)

	// for each binned column, derive a sorted & counted subtable
	// note that only bins with at least one entry will have a row,
	// so we could have less than 10 bins
	const counted = numeric.reduce((acc, cur) => {
		const bins = binRollup
			.orderby(cur)
			.groupby(cur)
			.count()
			.objects()
			.sort((a, b) => a[cur] - b[cur])
			.map(d => ({
				min: d[cur],
				count: d.count,
			}))
		acc[`${cur}.bins`] = bins
		return acc
	}, {} as Record<string, Bin[]>)

	return counted
}

// TODO: arquero does autotyping on load, is this meta stored internally?
// https://uwdata.github.io/arquero/api/#fromCSV
// TODO: this doesn't recognize dates if arquero didn't parse them
/**
 * Generates column typings info for a table.
 * @param table
 * @returns
 */
export function types(table: ColumnTable): Record<string, string> {
	const sampled = table.sample(SAMPLE_MAX)
	return sampled.columnNames().reduce((acc, cur) => {
		const values = table.array(cur)
		// use the first valid value to guess type
		values.some((value, index) => {
			if (value !== null && value !== undefined) {
				acc[cur] = determineType(value)
				return true
			}
			return false
		})
		return acc
	}, {} as Record<string, string>)
}

/**
 * Guess the type of a table value with more discernment than typeof
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof
 * @param value
 * @returns
 */
export function determineType(value: any): string {
	let type = typeof value as string
	if (type === 'object') {
		if (isDate(value)) {
			type = 'date'
		} else if (isArray(value)) {
			type = 'array'
		}
	}
	return type
}