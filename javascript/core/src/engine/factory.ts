/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { v4 as uuid } from 'uuid'

import { BinStrategy } from '../index.js'
import type { Step } from '../types.js'
import {
	BooleanLogicalOperator,
	FieldAggregateOperation,
	JoinStrategy,
	Verb,
} from '../types.js'

/**
 * Factory function to create new verb configs
 * with as many reasonable defaults as possible.
 * TODO: if we accepted a table (or TableStore) we could do column lookups and such
 * to preselect.
 * @param verb -
 */
export function factory(verb: Verb, inputs: Step['inputs']): Step {
	const base = {
		id: uuid(),
		verb,
		inputs,
	}
	switch (verb) {
		case Verb.Chain:
			return {
				...base,
				args: {
					steps: [],
				},
			}
		case Verb.Bin:
			return {
				...base,
				args: {
					to: 'output',
					strategy: BinStrategy.Auto,
					fixedcount: 10,
				},
			}
		case Verb.Aggregate:
		case Verb.Boolean:
		case Verb.Derive:
		case Verb.Impute:
		case Verb.Fill:
		case Verb.Merge:
		case Verb.Rollup:
		case Verb.Window:
			return {
				...base,
				args: {
					to: 'output',
				},
			}
		case Verb.Concat:
		case Verb.Difference:
		case Verb.Intersect:
		case Verb.Union:
			return {
				...base,
				args: {
					others: [],
				},
			}
		case Verb.Fold:
			return {
				...base,
				args: {
					to: ['key', 'value'],
					columns: [],
				},
			}
		case Verb.Convert:
		case Verb.Lookup:
		case Verb.Groupby:
		case Verb.Dedupe:
		case Verb.Select:
		case Verb.Unroll:
			return {
				...base,
				args: {
					columns: [],
				},
			}
		case Verb.Spread:
			return {
				...base,
				args: {
					to: [],
				},
			}
		case Verb.Pivot:
			return {
				...base,
				args: {
					operation: FieldAggregateOperation.Any,
				},
			}
		case Verb.Join:
			return {
				...base,
				args: {
					strategy: JoinStrategy.Inner,
				},
			}
		case Verb.Binarize:
			return {
				...base,
				args: {
					to: 'output',
					criteria: [],
					logical: BooleanLogicalOperator.OR,
				},
			}
		case Verb.Filter:
			return {
				...base,
				args: {
					criteria: [],
					logical: BooleanLogicalOperator.OR,
				},
			}
		case Verb.Fetch:
		case Verb.Orderby:
		case Verb.Rename:
		case Verb.Sample:
		case Verb.Ungroup:
		case Verb.Unorder:
		case Verb.Erase:
		case Verb.Unfold:
	}
	return {
		...base,
		args: {},
	}
}