/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step } from '@data-wrangling-components/core'
export type StepAddFunction = (step: Partial<Step>) => void
export type StepUpdateFunction = (
	step: Partial<Step>,
	update: Partial<Step>,
) => void
export type StepRemoveFunction = (step: Partial<Step>) => void
