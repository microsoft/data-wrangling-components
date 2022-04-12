/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { InputColumnListArgs } from './types.js'
import type { ColumnTableStep } from './util/factories.js'
import { stepVerbFactory } from './util/factories.js'

export type DedupeArgs = Partial<InputColumnListArgs>

export const dedupeStep: ColumnTableStep<DedupeArgs> = (input, { columns }) =>
	columns ? input.dedupe(columns) : input.dedupe()
export const dedupe = stepVerbFactory(dedupeStep)
