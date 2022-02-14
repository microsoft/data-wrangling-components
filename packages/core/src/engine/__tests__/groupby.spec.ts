/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Step, Verb } from '../../types.js'
import { groupby } from '../verbs/groupby.js'
import { TestStore } from './TestStore.js'

describe('test for groupby verb', () => {
	test('groupby test', () => {
		const step: Step = {
			verb: Verb.Groupby,
			input: 'table1',
			output: 'output',
			args: {
				columns: ['ID'],
			},
		}

		const store = new TestStore()

		return groupby(step, store).then(result => {
			expect(result.numCols()).toBe(3)
			expect(result.numRows()).toBe(5)
		})
	})
})
