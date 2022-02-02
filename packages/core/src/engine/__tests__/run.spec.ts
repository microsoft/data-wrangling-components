/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { table } from 'arquero'
import { Verb, Step, StepType, TableStore, CompoundStep } from '../..'
import { run } from '../run'

describe('run', () => {
	const input = table({
		ID: [1, 2, 3, 4],
	})

	let store: TableStore

	beforeEach(() => {
		store = new TableStore()
		store.set('input', input)
	})

	test('runs a single step with normal input/output', () => {
		const steps: Step[] = [
			{
				type: StepType.Verb,
				verb: Verb.Fill,
				input: 'input',
				output: 'output',
				args: {
					to: 'filled',
					value: 1,
				},
			},
		]

		return run(steps, store).then(result => {
			expect(result.numCols()).toBe(2)
			expect(result.numRows()).toBe(4)
			expect(store.list()).toEqual(['input', 'output'])
		})
	})

	test('runs multiple steps with normal input/output', () => {
		const steps: Step[] = [
			{
				type: StepType.Verb,
				verb: Verb.Fill,
				input: 'input',
				output: 'output-1',
				args: {
					to: 'filled',
					value: 1,
				},
			},
			{
				type: StepType.Verb,
				verb: Verb.Fill,
				input: 'output-1',
				output: 'output-2',
				args: {
					to: 'filled2',
					value: 2,
				},
			},
		]

		return run(steps, store).then(result => {
			expect(result.numCols()).toBe(3)
			expect(result.numRows()).toBe(4)
			expect(result.columnNames()).toEqual(['ID', 'filled', 'filled2'])
			expect(store.list()).toEqual(['input', 'output-1', 'output-2'])
		})
	})

	test('compound step should not pollute the parent store', () => {
		const steps: CompoundStep[] = [
			{
				type: StepType.Compound,
				verb: Verb.Fill,
				input: 'input',
				output: 'output',
				args: {},
				steps: [
					{
						type: StepType.Verb,
						verb: Verb.Fill,
						input: 'input',
						output: 'output-1',
						args: {
							to: 'filled',
							value: 1,
						},
					},
					{
						type: StepType.Verb,
						verb: Verb.Fill,
						input: 'output-1',
						output: 'output-2',
						args: {
							to: 'filled2',
							value: 2,
						},
					},
				],
			},
		]

		return run(steps, store).then(result => {
			expect(result.numCols()).toBe(3)
			expect(result.numRows()).toBe(4)
			expect(result.columnNames()).toEqual(['ID', 'filled', 'filled2'])
			expect(store.list()).toEqual(['input', 'output'])
		})
	})

	test('compound steps run recursively', () => {
		const steps: CompoundStep[] = [
			{
				type: StepType.Compound,
				verb: Verb.Fill,
				input: 'input',
				output: 'output',
				args: {},
				steps: [
					{
						type: StepType.Verb,
						verb: Verb.Fill,
						input: 'input',
						output: 'output-1',
						args: {
							to: 'filled',
							value: 1,
						},
					},
					{
						type: StepType.Compound,
						verb: Verb.Fill,
						input: 'output-1',
						output: 'output-2',
						args: {},
						steps: [
							{
								type: StepType.Verb,
								verb: Verb.Fill,
								input: 'output-1',
								output: 'output-2',
								args: {
									to: 'filled2',
									value: 2,
								},
							},
						],
					} as CompoundStep,
				],
			},
		]

		return run(steps, store).then(result => {
			expect(result.numCols()).toBe(3)
			expect(result.numRows()).toBe(4)
			expect(result.columnNames()).toEqual(['ID', 'filled', 'filled2'])
			expect(store.list()).toEqual(['input', 'output'])
		})
	})
})