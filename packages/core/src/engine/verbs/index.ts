/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { BinStrategy } from '../../index.js'
import { Step, Verb } from '../../types.js'

/**
 * Factory function to create new verb configs
 * with as many reasonable defaults as possible.
 * TODO: if we accepted a table (or TableStore) we could do column lookups and such
 * to preselect.
 * @param verb
 */
export function factory(verb: Verb, input: string, output: string): Step {
	const base = {
		verb,
		input,
		output,
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
		case Verb.Binarize:
		case Verb.Derive:
		case Verb.Impute:
		case Verb.Fill:
		case Verb.Rollup:
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
		case Verb.Lookup:
		case Verb.Groupby:
		case Verb.Dedupe:
		case Verb.Spread:
		case Verb.Unroll:
			return {
				...base,
				args: {
					columns: [],
				},
			}
		case Verb.Fetch:
		case Verb.Filter:
		case Verb.Join:
		case Verb.Orderby:
		case Verb.Rename:
		case Verb.Sample:
		case Verb.Select:
		case Verb.Ungroup:
		case Verb.Unorder:
	}
	return {
		...base,
		args: {},
	}
}
