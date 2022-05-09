/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step } from '@data-wrangling-components/core'

export interface StepListProps {
	steps: Step[]
	outputs: Array<string | undefined>
	buttonId?: string | undefined
	onDeleteClicked?: (index: number) => void
	onEditClicked?: (step: Step, index: number) => void
	onDuplicateClicked?: (step: Step) => void
	onSelect?: (name: string) => void
	onStartNewStep?: () => void
}
