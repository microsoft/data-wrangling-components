/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { FieldAggregateOperation } from '../../index.js'
import type { Step } from '../../types.js'
import { Verb } from '../../types.js'
import { pivot } from '../verbs/pivot.js'
import { TestStore } from './TestStore.js'

describe('test for pivot verb', () => {
	test('pivot test with any operation', async () => {
		const step: Step = {
			verb: Verb.Pivot,
			input: 'table16',
			output: 'output',
			args: {
				key: 'key',
				value: 'value',
				operation: FieldAggregateOperation.Any,
			},
		}

		const store = new TestStore()

		return pivot(step, store).then(result => {
			expect(result.table.numCols()).toBe(3)
			expect(result.table.numRows()).toBe(1)
			expect(result.table.get('A', 0)).toBe(1)
			expect(result.table.get('B', 0)).toBe(2)
			expect(result.table.get('C', 0)).toBe(3)
		})
	})

	test('pivot test with sum operation', async () => {
		const step: Step = {
			verb: Verb.Pivot,
			input: 'table17',
			output: 'output',
			args: {
				key: 'name',
				value: 'count',
				operation: FieldAggregateOperation.Sum,
			},
		}

		const store = new TestStore()

		return pivot(step, store).then(result => {
			expect(result.table.numCols()).toBe(2)
			expect(result.table.numRows()).toBe(1)
			expect(result.table.get('A', 0)).toBe(7)
			expect(result.table.get('B', 0)).toBe(8)
		})
	})

	test('pivot test with max operation', async () => {
		const step: Step = {
			verb: Verb.Pivot,
			input: 'table17',
			output: 'output',
			args: {
				key: 'name',
				value: 'count',
				operation: FieldAggregateOperation.Max,
			},
		}

		const store = new TestStore()

		return pivot(step, store).then(result => {
			expect(result.table.numCols()).toBe(2)
			expect(result.table.numRows()).toBe(1)
			expect(result.table.get('A', 0)).toBe(4)
			expect(result.table.get('B', 0)).toBe(5)
		})
	})

	test('pivot test with min operation', async () => {
		const step: Step = {
			verb: Verb.Pivot,
			input: 'table17',
			output: 'output',
			args: {
				key: 'name',
				value: 'count',
				operation: FieldAggregateOperation.Min,
			},
		}

		const store = new TestStore()

		return pivot(step, store).then(result => {
			expect(result.table.numCols()).toBe(2)
			expect(result.table.numRows()).toBe(1)
			expect(result.table.get('A', 0)).toBe(1)
			expect(result.table.get('B', 0)).toBe(3)
		})
	})

	test('pivot test with mean operation', async () => {
		const step: Step = {
			verb: Verb.Pivot,
			input: 'table17',
			output: 'output',
			args: {
				key: 'name',
				value: 'count',
				operation: FieldAggregateOperation.Mean,
			},
		}

		const store = new TestStore()

		return pivot(step, store).then(result => {
			expect(result.table.numCols()).toBe(2)
			expect(result.table.numRows()).toBe(1)
			expect(result.table.get('A', 0)).toBe(2.3333333333333335)
			expect(result.table.get('B', 0)).toBe(4)
		})
	})

	test('pivot test with median operation', async () => {
		const step: Step = {
			verb: Verb.Pivot,
			input: 'table17',
			output: 'output',
			args: {
				key: 'name',
				value: 'count',
				operation: FieldAggregateOperation.Median,
			},
		}

		const store = new TestStore()

		return pivot(step, store).then(result => {
			expect(result.table.numCols()).toBe(2)
			expect(result.table.numRows()).toBe(1)
			expect(result.table.get('A', 0)).toBe(2)
			expect(result.table.get('B', 0)).toBe(4)
		})
	})
})
