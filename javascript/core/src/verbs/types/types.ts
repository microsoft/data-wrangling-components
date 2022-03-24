/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Value } from '../../tables/types.js'
import type {
	BinStrategy,
	BooleanComparisonOperator,
	BooleanLogicalOperator,
	FieldAggregateOperation,
	FilterCompareType,
	JoinStrategy,
	MathOperator,
	MergeStrategy,
	NumericComparisonOperator,
	ParseType,
	SortDirection,
	StringComparisonOperator,
	WindowFunction,
} from './enums.js'

// #region reusable base interfaces to aid consistency
export interface InputColumnArgs {
	/**
	 * Name of the input column for columnnar operations.
	 */
	column: string
}

/**
 * Base interface for a number of operations that work on a column list.
 */
export interface InputColumnListArgs {
	columns: string[]
}

export interface InputColumnRecordArgs {
	/**
	 * Map of old column to new column names
	 */
	columns: Record<string, string>
}

export interface OutputColumnArgs {
	/**
	 * Name of the output column to receive the operation's result.
	 */
	to: string
}

// #endregion

export interface AggregateArgs extends RollupArgs {
	/**
	 * Column to group by
	 */
	groupby: string
}

export interface BinArgs extends InputColumnArgs, OutputColumnArgs {
	strategy: BinStrategy
	/**
	 * Fixed number of bins.
	 * Note that the bin placements are inclusive of the bottom boundary and exclusive of the top boundary -
	 * this means there is always one extra bin for the max value when using fixed count.
	 */
	fixedcount?: number
	/**
	 * Exact step size between bins
	 */
	fixedwidth?: number
	/**
	 * Min boundary to categorize values into.
	 * If cell values are below this, they will default to -Infinity unless clamped.
	 */
	min?: number
	/**
	 * Max boundary to categorize values into.
	 * If cell values are above this, they will default to +Infinity unless clamped.
	 */
	max?: number
	/**
	 * If true, values outside of the min/max boundaries will be clamped to those
	 * boundaries rather than +/-Infinity.
	 */
	clamped?: boolean
}

export interface BinarizeArgs extends FilterArgs, OutputColumnArgs {}

export interface BooleanArgs extends InputColumnListArgs, OutputColumnArgs {
	operator: BooleanLogicalOperator
}

export interface ConvertArgs extends InputColumnListArgs {
	type: ParseType
	/**
	 * Optional radix to use for parsing strings into ints
	 */
	radix?: number
}

export type DedupeArgs = Partial<InputColumnListArgs>

export interface DeriveArgs extends OutputColumnArgs {
	/**
	 * Column on the left side of the operation
	 */
	column1: string
	/**
	 * Column on the right side of the operation
	 */
	column2: string

	operator: MathOperator
}

export interface FetchArgs {
	/**
	 * URL where the csv file is located
	 */
	url: string
	/**
	 * Optional delimiter for csv
	 */
	delimiter?: string
	/**
	 * Optional autoMax for tables
	 */
	autoMax?: number
}

export interface FillArgs extends OutputColumnArgs {
	/**
	 * Value to fill in the new column
	 */
	value: Value
}

export interface EraseArgs {
	column: string
	value: Value
}

export interface FilterArgs extends InputColumnArgs {
	criteria: Criterion[]
	logical?: BooleanLogicalOperator
}

export interface FoldArgs extends InputColumnListArgs {
	/**
	 * Two-element array of names for the output [key, value]
	 */
	to?: [string, string]
}

export interface PivotArgs {
	key: string
	value: string
	operation: FieldAggregateOperation
}

export interface UnfoldArgs {
	key: string
	value: string
}

export type GroupbyArgs = InputColumnListArgs

export interface ImputeArgs extends InputColumnArgs {
	/**
	 * Value to fill in empty cells
	 */
	value: Value
}

export interface JoinArgsBase {
	/**
	 * Name of the other table to join to the main input
	 */
	other: string
	/**
	 * Column names to join with.
	 * If only one is specified, it will use for both tables.
	 * If none are specified, all matching column names will be used.
	 */
	on?: string[]
}

export interface JoinArgs extends JoinArgsBase {
	strategy?: JoinStrategy
}

export interface LookupArgs extends JoinArgsBase, InputColumnListArgs {}

export interface RecodeArgs extends InputColumnArgs, OutputColumnArgs {
	/**
	 * Mapping of old value to new for the recoding.
	 * Note that the key must be coercable to a string for map lookup.
	 */
	map: Record<Value, Value>
}

export type RenameArgs = InputColumnRecordArgs

export interface RollupArgs extends InputColumnArgs, OutputColumnArgs {
	/**
	 * Aggregate/rollup operation
	 */
	operation: FieldAggregateOperation
}

export interface SampleArgs {
	/**
	 * Number of rows to sample from the table.
	 * This takes precedence over proportion.
	 */
	size?: number
	/**
	 * If table size is unknown ahead of time, specify a proportion of rows to sample.
	 * If size is specified, it will be used instead, otherwise computed from this
	 * proportion using the table.numRows()
	 */
	proportion?: number
}

export type SelectArgs = InputColumnListArgs

export interface SpreadArgs {
	column: string
	to: string[]
}

export interface MergeArgs extends InputColumnListArgs, OutputColumnArgs {
	strategy: MergeStrategy
	/**
	 * This is only necessary if mergeStrategy.Concat is used.
	 * If it is not supplied, the values are just mashed together.
	 */
	delimiter?: string
}

export interface OrderbyArgs {
	/**
	 * List of ordering instructions to apply
	 */
	orders: OrderbyInstruction[]
}

export interface SetOperationArgs {
	/**
	 * Other tables to apply this set operation to.
	 */
	others: string[]
}

export type UnrollArgs = InputColumnListArgs

export interface WindowArgs extends InputColumnArgs, OutputColumnArgs {
	operation: WindowFunction
}

export interface OrderbyInstruction {
	column: string
	direction?: SortDirection
}

export interface Criterion {
	/**
	 * Comparison value for the column
	 */
	value: Value
	/**
	 * Indicates whether the filter should be directly against a value,
	 * or against the value of another column
	 */
	type: FilterCompareType
	// TODO: we should support Date comparisons
	operator:
		| NumericComparisonOperator
		| StringComparisonOperator
		| BooleanComparisonOperator
}