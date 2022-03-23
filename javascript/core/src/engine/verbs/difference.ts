/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { SetOp } from '../../types.js'
import { SetOperationNode } from '../factories.js'

/**
 * Executes an arquero table difference.
 */
export function difference(id: string): SetOperationNode {
	return new SetOperationNode(id, SetOp.Difference)
}
