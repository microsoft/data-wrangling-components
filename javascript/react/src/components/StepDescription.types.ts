/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step } from '@data-wrangling-components/core'

export interface StepDescriptionProps {
	/**
	 * The processing step
	 */
	step: Step

	/**
	 * The output table name
	 */
	output?: string
}
