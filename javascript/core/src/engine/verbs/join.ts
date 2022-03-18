/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { JoinOptions } from 'arquero/dist/types/table/transformable'

import { container } from '../../container.js'
import type { TableStore } from '../../index.js'
import type { JoinStep, TableContainer } from '../../types.js'
import { JoinStrategy } from '../../types.js'

/**
 * Executes an arquero join.
 * @param step
 * @param store
 * @returns
 */
export async function join(
	{
		input,
		output,
		args: { other, on, strategy = JoinStrategy.Inner },
	}: JoinStep,
	store: TableStore,
): Promise<TableContainer> {
	const [inputTable, otherTable] = await Promise.all([
		store.table(input),
		store.table(other),
	])

	const options: JoinOptions = {
		left:
			strategy === JoinStrategy.LeftOuter ||
			strategy === JoinStrategy.FullOuter,
		right:
			strategy === JoinStrategy.RightOuter ||
			strategy === JoinStrategy.FullOuter,
	}

	return container(output, inputTable.join(otherTable, on, undefined, options))
}
