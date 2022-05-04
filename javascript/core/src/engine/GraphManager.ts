/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TableContainer } from '@essex/arquero'
import type { Graph, Node } from '@essex/dataflow'
import { DefaultGraph, observableNode } from '@essex/dataflow'
import type { Observable, Subscription } from 'rxjs'
import { from, Subject } from 'rxjs'

import type { Maybe } from '../primitives.js'
import type { NamedOutputPortBinding, NamedPortBinding } from '../types.js'
import type { Step, StepInput } from '../steps/index.js'
import { createNode } from './createNode.js'
import { Workflow } from './Workflow.js'

// this could be used for (a) factory of step configs, (b) management of execution order
// (c) add/delete and correct reset of params, and so on

export type TableObservable = Observable<Maybe<TableContainer>>
/**
 * Manages a series of pipeline steps for interactive clients. This class specifically keeps a
 * workflow specification synchronized with a live processing graph and provides utility methods
 * for mutating the workflow.
 */
export class GraphManager {
	// The dataflow graph
	private readonly _graph: Graph<TableContainer> = new DefaultGraph()

	// The global onChange handler
	private readonly _onChange = new Subject<void>()

	//
	// Output tracking - observables, data cache, subscriptions
	//
	private readonly outputObservables: Map<string, TableObservable> = new Map()
	private readonly outputCache: Map<string, Maybe<TableContainer>> = new Map()
	private readonly outputSubscriptions: Map<string, Subscription> = new Map()

	public constructor(
		private readonly _inputs: Map<string, TableContainer> = new Map(),
		private readonly _workflow: Workflow,
	) {
		this._syncWorkflowStateIntoGraph()
	}

	/**
	 * Synchronizez the workflow state into the graph. Used during initialization.
	 */
	private _syncWorkflowStateIntoGraph() {
		for (const i of this._inputs.keys()) {
			this._workflow.addInput(i)
		}
		for (const step of this._workflow.steps) {
			this._addWorkflowStepToGraph(step)
		}
		for (const value of this._workflow.output.values()) {
			this._bindGraphOutput(value)
		}
	}

	public get inputs(): Map<string, TableContainer> {
		return this._inputs
	}

	public get graph(): Graph<TableContainer> {
		return this._graph
	}

	public get workflow(): Workflow {
		return this._workflow
	}

	/**
	 * The number of steps in the workflow
	 */
	public get numSteps(): number {
		return this._workflow.length
	}

	/**
	 * The steps in the worfklow
	 */
	public get steps(): Step[] {
		return this._workflow.steps
	}

	/**
	 * Remove all steps, inputs, and outputs from the pipeline
	 */
	public clear(): void {
		this._workflow.clear()
	}

	/**
	 * Add a named input
	 * @param input - the input table to add
	 */
	public addInput(item: TableContainer): void {
		this._workflow.addInput(item.id)
		this.inputs.set(item.id, item)
		this._onChange.next()
	}

	/**
	 * Removes a named input
	 * @param inputId - The input id to remove
	 */
	public removeInput(inputName: string): void {
		this._workflow.removeInput(inputName)
		this.inputs.delete(inputName)
		this._onChange.next()
	}

	/**
	 * Adds a step to the pipeline
	 * @param step - the step to add
	 */
	public addStep(stepInput: StepInput): Step {
		const step = this._workflow.addStep(stepInput)
		this._addWorkflowStepToGraph(step)
		this._onChange.next()
		return step
	}

	private _addWorkflowStepToGraph(step: Step): void {
		// create the graph node
		const node = createNode(step)
		this._graph.add(node)

		// wire up the graph node
		this._configureStep(step, node)
	}

	/**
	 * Deletes steps from the given index (inclusive) to the end of the array
	 * @param index - The index to delete after
	 */
	public removeStep(index: number): void {
		const step = this._workflow.steps[index]!
		const prevStep = index > 0 ? this._workflow.steps[index - 1] : undefined
		const nextStep =
			index + 1 < this.numSteps ? this._workflow.steps[index + 1] : undefined
		const node = this.getNode(step.id)

		// If step was auto-bound, try to wire together the prev and next steps
		if (
			!hasDefinedInputs(step) &&
			hasPossibleInputs(node) &&
			prevStep &&
			nextStep
		) {
			// bind the output of the previous into the input of the next
			const prevNode = this.getNode(prevStep.id)
			const nextNode = this.getNode(nextStep.id)
			nextNode.bind({ node: prevNode })
		}

		// Remove the step from the graph
		this._graph.remove(step.id)
		this._onChange.next()
	}

	/**
	 * Reconfigure a step at an index
	 * @param index - The step index
	 * @param step - The step specification
	 */
	public reconfigureStep(index: number, stepInput: StepInput<unknown>): void {
		const prevVersion = this._workflow.stepAt(index)!
		const step = this._workflow.updateStep(stepInput, index)
		const node = this.getNode(step.id)

		// todo: handle rename. Add graph.rename(nodeId) method
		if (prevVersion.id !== step.id) {
			throw new Error('node rename not supported yet')
		}

		// todo: add node.clearBindings() to dataflow node
		for (const binding of node.bindings()) {
			node.unbind(binding.input)
		}

		this._configureStep(step, node)
		this._onChange.next()
	}

	/**
	 * Add an output binding
	 * @param binding - The output binding
	 */
	public addOutput(binding: NamedOutputPortBinding): void {
		this._workflow.addOutput(binding)
		this._bindGraphOutput(binding)
		this._onChange.next()
	}

	private _bindGraphOutput(binding: NamedOutputPortBinding) {
		const name = binding.name
		// Register the output in the table store
		const node = this.getNode(binding.node)
		const boundOutput = node.output(binding.output)
		this.outputObservables.set(name, boundOutput)
		const subscription = boundOutput.subscribe(latest => {
			this.outputCache.set(name, latest)
			this._onChange.next()
		})
		this.outputSubscriptions.set(name, subscription)
	}

	/**
	 * Remove an output binding
	 * @param name - the output name to remove
	 */
	public removeOutput(name: string): void {
		this._workflow.removeOutput(name)
		this.outputObservables.delete(name)
		this.outputSubscriptions.get(name)?.unsubscribe()
		this.outputSubscriptions.delete(name)
		this.outputCache.delete(name)
		this._onChange.next()
	}

	/**
	 * Log out the steps
	 */
	public print(): void {
		console.log(this._workflow.steps)
	}

	/**
	 * Gets the output table names
	 */
	public get outputs(): string[] {
		return [...this.outputObservables.keys()]
	}

	/**
	 * Observe an output name
	 * @param name - The output to observe
	 */
	public output(name: string): TableObservable {
		return this.outputObservables.get(name)!
	}

	/**
	 * Get the latest output value
	 * @param name - The output to retrieve
	 */
	public latest(name: string): Maybe<TableContainer> {
		return this.outputCache.get(name)
	}

	/**
	 * Gets a map of the current output tables
	 * @returns The output cache
	 */
	public toMap(): Map<string, Maybe<TableContainer>> {
		return this.outputCache
	}

	/**
	 * Listen to changes in the Workflow graph
	 * @param handler - The onChange handler
	 */
	public onChange(handler: () => void): () => void {
		const sub = this._onChange.subscribe(handler)
		return () => sub.unsubscribe()
	}

	private _configureStep(step: Step, node: Node<TableContainer>) {
		// if any inputs nodes are in the graph, bind them
		if (hasDefinedInputs(step)) {
			for (const [input, binding] of Object.entries(step.input)) {
				// Bind variadic input
				if (input === 'others') {
					const vBind = binding as NamedPortBinding[]
					node.bindVariadic(
						vBind.map(b => ({ node: this.getNode(b.node), output: b.output })),
					)
				} else {
					// Bind the named input
					const b = binding as NamedPortBinding
					node.bind({ input, node: this.getNode(b.node), output: b.output })
				}
			}
		} else if (this._workflow.steps.length > 0 && node.inputs.length > 0) {
			// If no named input is present, try to auto-bind to the previous node
			const prevStep = this._workflow.steps[this._workflow.steps.length - 1]!
			node.bind({ node: this.getNode(prevStep.id) })
		}
	}

	private getNode(id: string): Node<TableContainer> {
		const graph = this.graph
		// bind to an input defined in the graph
		if (graph.hasNode(id)) {
			return graph.node(id)
		} else if (this._workflow.hasInput(id)) {
			// bind to a declared input
			return observableNode(id, from([this.inputs.get(id)]))
		} else {
			throw new Error(`unknown node id or declared input: "${id}"`)
		}
	}
}

export function createGraphManager(
	inputs?: Map<string, TableContainer> | undefined,
	workflow?: Workflow | undefined,
): GraphManager {
	return new GraphManager(inputs, workflow ?? new Workflow())
}

function hasDefinedInputs(step: Step): boolean {
	return Object.keys(step.input).length > 0
}

function hasPossibleInputs(node: Node<unknown>) {
	return node.inputs.length > 0
}
