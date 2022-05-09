/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step } from '@data-wrangling-components/core'

export interface StepCardProps {
	step: Step
	index: number
	output: string | undefined
	onEdit?: (step: Step, index: number) => void
	onDelete?: (index: number) => void
	onDuplicate?: (step: Step) => void
	onSelect?: (name: string) => void
}
