/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Verb } from '../verbs/types/index.js'
import type {
	AggregateArgs,
	BinArgs,
	BinarizeArgs,
	BooleanArgs,
	ConvertArgs,
	DedupeArgs,
	DeriveArgs,
	EraseArgs,
	FetchArgs,
	FillArgs,
	FilterArgs,
	FoldArgs,
	GroupbyArgs,
	ImputeArgs,
	InputColumnListArgs,
	JoinArgs,
	LookupArgs,
	MergeArgs,
	OrderbyArgs,
	PivotArgs,
	RecodeArgs,
	RenameArgs,
	RollupArgs,
	SampleArgs,
	SelectArgs,
	SetOperationArgs,
	SpreadArgs,
	UnfoldArgs,
	UnrollArgs,
	WindowArgs,
} from '../verbs/types/types.js'

export interface Step<T = unknown> {
	/**
	 * A unique identifier for this step
	 */
	id: string

	/**
	 * helpful for documentation in JSON specs
	 */
	description?: string

	/**
	 * The verb being executed
	 */
	verb: Verb

	/**
	 * The verb arguments
	 */
	args: T

	/**
	 * The bound inputs
	 */
	inputs: Record<string, { node: string; output?: string }>
}

export type AggregateStep = Step<AggregateArgs>
export type BinStep = Step<BinArgs>
export type BinarizeStep = Step<BinarizeArgs>
export type BooleanStep = Step<BooleanArgs>
export type ColumnListStep = Step<InputColumnListArgs>
export type ConvertStep = Step<ConvertArgs>
export type DedupeStep = Step<DedupeArgs>
export type DeriveStep = Step<DeriveArgs>
export type EraseStep = Step<EraseArgs>
export type ImputeStep = Step<ImputeArgs>
export type FetchStep = Step<FetchArgs>
export type FillStep = Step<FillArgs>
export type FilterStep = Step<FilterArgs>
export type FoldStep = Step<FoldArgs>
export type GroupbyStep = Step<GroupbyArgs>
export type JoinStep = Step<JoinArgs>
export type LookupStep = Step<LookupArgs>
export type MergeStep = Step<MergeArgs>
export type PivotStep = Step<PivotArgs>
export type OrderbyStep = Step<OrderbyArgs>
export type RecodeStep = Step<RecodeArgs>
export type RenameStep = Step<RenameArgs>
export type RollupStep = Step<RollupArgs>
export type SampleStep = Step<SampleArgs>
export type SelectStep = Step<SelectArgs>
export type SpreadStep = Step<SpreadArgs>
export type UnfoldStep = Step<UnfoldArgs>
export type UnrollStep = Step<UnrollArgs>
export type SetOperationStep = Step<SetOperationArgs>
export type WindowStep = Step<WindowArgs>