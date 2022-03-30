/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { TestStore } from '../../__tests__/TestStore.js'
import { observableNode } from '../../graph/index.js'
import { difference } from '../difference.js'

describe('test for difference verb', () => {
	test('difference test with no duplicates', () => {
		const store = new TestStore()

		const table1 = observableNode('input', store.observe('table1')!)
		const table2 = observableNode('input', store.observe('table2')!)

		expect(table1.outputValue()).toBeDefined()
		expect(table2.outputValue()).toBeDefined()

		const node = difference('output')
		node.bind({ node: table1 })
		node.bindVariadic([{ node: table2 }])

		const result = node.outputValue()

		// no dups in table2, so output should match original
		expect(result?.table?.numCols()).toBe(3)
		expect(result?.table?.numRows()).toBe(5)
	})
})
