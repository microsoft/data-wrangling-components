/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Pipeline } from '@data-wrangling-components/core'
import type { TableContainer } from '@essex/arquero'
import { useCallback } from 'react'

export function useRunPipeline(
	pipeline: Pipeline,
	setSelectedTableName?: (name: string) => void,
	setSelectedTable?: (table: TableContainer) => void,
): () => Promise<void> {
	return useCallback(async () => {
		if (pipeline.steps.length) {
			const output = await pipeline.run()
			setSelectedTableName?.(output.id)
			setSelectedTable?.(output)
		}
	}, [pipeline, setSelectedTableName, setSelectedTable])
}