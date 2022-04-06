/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { EraseStep } from '../../types.js'
import { Verb } from '../../types.js'
import { erase } from '../verbs/erase.js'
import { TestStore } from './TestStore.js'

describe('test for erase verb', () => {
	test('erase numeric value', () => {
		const step: EraseStep = {
			verb: Verb.Erase,
			input: 'table3',
			output: 'output',
			args: { value: 4, columns: ['ID'] },
		}

		const store = new TestStore()

		return erase(step, store).then(result => {
			expect(result.table!.numCols()).toBe(2)
			expect(result.table!.numRows()).toBe(6)
			expect(result.table!.get('ID', 3)).toBeNull()
			expect(result.table!.get('ID', 4)).toBeNull()
			expect(result.table!.get('ID', 5)).toBeNull()
		})
	})

	test('erase string value', () => {
		const step: EraseStep = {
			verb: Verb.Erase,
			input: 'table3',
			output: 'output',
			args: { value: 'sofa', columns: ['item'] },
		}

		const store = new TestStore()

		return erase(step, store).then(result => {
			expect(result.table!.numCols()).toBe(2)
			expect(result.table!.numRows()).toBe(6)
			expect(result.table!.get('item', 2)).toBeNull()
			expect(result.table!.get('item', 3)).toBeNull()
		})
	})
})
