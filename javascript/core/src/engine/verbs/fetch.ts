/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { loadCSV, loadJSON } from 'arquero'

import { container } from '../../factories.js'
import type { FetchArgs, Step, TableStore } from '../../index.js'
import type { TableContainer } from '../../types.js'

/**
 * Executes an arquero loadCSV
 * @param step
 * @param store
 * @returns
 */
export async function fetch(
	step: Step,
	_store: TableStore,
): Promise<TableContainer> {
	const { output, args } = step
	const { url, delimiter, autoMax } = args as FetchArgs

	if (url.toLowerCase().endsWith('.json')) {
		const tableFromJSON = await loadJSON(url, {
			autoType: autoMax === undefined || autoMax <= 0 ? false : true,
		})

		return container(output, tableFromJSON)
	} else {
		const tableFromCSV = await loadCSV(url, {
			delimiter: delimiter,
			autoMax: autoMax !== undefined ? autoMax : 0,
			autoType: autoMax === undefined || autoMax <= 0 ? false : true,
		})

		return container(output, tableFromCSV)
	}
}
