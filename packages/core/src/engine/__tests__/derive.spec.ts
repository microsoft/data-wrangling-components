/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { MathOperator, Step, Verb } from '../../types.js'
import { derive } from '../verbs/derive.js'
import { TestStore } from './TestStore.js'

describe('test for derive verb', () => {
	test('derive test with MathOperator Add and string + number', () => {
		const step: Step = {
			verb: Verb.Derive,
			input: 'table1',
			output: 'output',
			args: {
				to: 'newColumn',
				column1: 'name',
				operator: MathOperator.Add,
				column2: 'count',
			},
		}

		const store = new TestStore()

		return derive(step, store).then(result => {
			// one new column
			expect(result.numCols()).toBe(4)
			// no new rows
			expect(result.numRows()).toBe(5)
			// spot check a couple of derives. we're mixing num/string here, so it'll just concat the values
			expect(result.get('newColumn', 0)).toBe('A10')
			expect(result.get('newColumn', 1)).toBe('B20')
			expect(result.get('newColumn', 2)).toBe('C30')
			expect(result.get('newColumn', 3)).toBe('D40')
			expect(result.get('newColumn', 4)).toBe('E50')
		})
	})

	test('derive test with MathOperator Substract and string - number', () => {
		const step: Step = {
			verb: Verb.Derive,
			input: 'table1',
			output: 'output',
			args: {
				to: 'newColumn',
				column1: 'name',
				operator: MathOperator.Subtract,
				column2: 'count',
			},
		}

		const store = new TestStore()

		return derive(step, store).then(result => {
			// one new column
			expect(result.numCols()).toBe(4)
			// no new rows
			expect(result.numRows()).toBe(5)
			expect(result.get('newColumn', 0)).toBeNaN()
			expect(result.get('newColumn', 1)).toBeNaN()
			expect(result.get('newColumn', 2)).toBeNaN()
			expect(result.get('newColumn', 3)).toBeNaN()
			expect(result.get('newColumn', 4)).toBeNaN()
		})
	})

	test('derive test with MathOperator Multiply and string - number', () => {
		const step: Step = {
			verb: Verb.Derive,
			input: 'table1',
			output: 'output',
			args: {
				to: 'newColumn',
				column1: 'name',
				operator: MathOperator.Multiply,
				column2: 'count',
			},
		}

		const store = new TestStore()

		return derive(step, store).then(result => {
			// one new column
			expect(result.numCols()).toBe(4)
			// no new rows
			expect(result.numRows()).toBe(5)
			expect(result.get('newColumn', 0)).toBeNaN()
			expect(result.get('newColumn', 1)).toBeNaN()
			expect(result.get('newColumn', 2)).toBeNaN()
			expect(result.get('newColumn', 3)).toBeNaN()
			expect(result.get('newColumn', 4)).toBeNaN()
		})
	})

	test('derive test with MathOperator Divide and string - number', () => {
		const step: Step = {
			verb: Verb.Derive,
			input: 'table1',
			output: 'output',
			args: {
				to: 'newColumn',
				column1: 'name',
				operator: MathOperator.Divide,
				column2: 'count',
			},
		}

		const store = new TestStore()

		return derive(step, store).then(result => {
			// one new column
			expect(result.numCols()).toBe(4)
			// no new rows
			expect(result.numRows()).toBe(5)
			expect(result.get('newColumn', 0)).toBeNaN()
			expect(result.get('newColumn', 1)).toBeNaN()
			expect(result.get('newColumn', 2)).toBeNaN()
			expect(result.get('newColumn', 3)).toBeNaN()
			expect(result.get('newColumn', 4)).toBeNaN()
		})
	})

	test('derive test with MathOperator Add and number + number', () => {
		const step: Step = {
			verb: Verb.Derive,
			input: 'table6',
			output: 'output',
			args: {
				to: 'newColumn',
				column1: 'FY20',
				operator: MathOperator.Add,
				column2: 'FY21',
			},
		}

		const store = new TestStore()

		return derive(step, store).then(result => {
			// one new column
			expect(result.numCols()).toBe(4)
			// no new rows
			expect(result.numRows()).toBe(6)
			expect(result.get('newColumn', 0)).toBe(15000)
			expect(result.get('newColumn', 1)).toBe(60000)
			expect(result.get('newColumn', 2)).toBe(90000)
			expect(result.get('newColumn', 3)).toBe(11000)
			expect(result.get('newColumn', 4)).toBe(17900)
			expect(result.get('newColumn', 5)).toBe(168000)
		})
	})

	test('derive test with MathOperator Subtract and number - number', () => {
		const step: Step = {
			verb: Verb.Derive,
			input: 'table6',
			output: 'output',
			args: {
				to: 'newColumn',
				column1: 'FY20',
				operator: MathOperator.Subtract,
				column2: 'FY21',
			},
		}

		const store = new TestStore()

		return derive(step, store).then(result => {
			// one new column
			expect(result.numCols()).toBe(4)
			// no new rows
			expect(result.numRows()).toBe(6)
			expect(result.get('newColumn', 0)).toBe(5000)
			expect(result.get('newColumn', 1)).toBe(52000)
			expect(result.get('newColumn', 2)).toBe(0)
			expect(result.get('newColumn', 3)).toBe(-1000)
			expect(result.get('newColumn', 4)).toBe(-100)
			expect(result.get('newColumn', 5)).toBe(12000)
		})
	})

	test('derive test with MathOperator Multiply and number * number', () => {
		const step: Step = {
			verb: Verb.Derive,
			input: 'table1',
			output: 'output',
			args: {
				to: 'newColumn',
				column1: 'ID',
				operator: MathOperator.Multiply,
				column2: 'count',
			},
		}

		const store = new TestStore()

		return derive(step, store).then(result => {
			// one new column
			expect(result.numCols()).toBe(4)
			// no new rows
			expect(result.numRows()).toBe(5)
			expect(result.get('newColumn', 0)).toBe(10)
			expect(result.get('newColumn', 1)).toBe(40)
			expect(result.get('newColumn', 2)).toBe(90)
			expect(result.get('newColumn', 3)).toBe(160)
			expect(result.get('newColumn', 4)).toBe(250)
		})
	})

	test('derive test with MathOperator Divide and number / number', () => {
		const step: Step = {
			verb: Verb.Derive,
			input: 'table7',
			output: 'output',
			args: {
				to: 'unitPrice',
				column1: 'totalSale',
				operator: MathOperator.Divide,
				column2: 'quantity',
			},
		}

		const store = new TestStore()

		return derive(step, store).then(result => {
			// one new column
			expect(result.numCols()).toBe(5)
			// no new rows
			expect(result.numRows()).toBe(5)
			expect(result.get('unitPrice', 0)).toBe(1200)
			expect(result.get('unitPrice', 1)).toBe(100)
			expect(result.get('unitPrice', 2)).toBe(2300)
			expect(result.get('unitPrice', 3)).toBe(230)
			expect(result.get('unitPrice', 4)).toBe(100)
		})
	})
})
