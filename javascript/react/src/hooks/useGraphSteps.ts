/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { GraphManager, Step } from '@data-wrangling-components/core'
import { useEffect,useState } from 'react'

/**
 * Gets the graph processing steps
 * @param graph - the graph manager
 * @returns
 */
export function useGraphSteps(graph: GraphManager): Step[] {
	const [steps, setSteps] = useState<Step[]>([])
	// listen for graph changes and update the steps
	useEffect(
		() => graph.onChange(() => setSteps(graph.steps)),
		[graph, setSteps],
	)
	return steps
}
