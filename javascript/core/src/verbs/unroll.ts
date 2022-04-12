/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { InputColumnListArgs } from './types.js'
import type { ColumnTableStep } from './util/factories.js'
import { stepVerbFactory } from './util/factories.js'

export type UnrollArgs = InputColumnListArgs

export const unrollStep: ColumnTableStep<UnrollArgs> = (input, { columns }) =>
	input.unroll(columns)

export const unroll = stepVerbFactory(unrollStep)
