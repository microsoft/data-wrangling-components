/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Workflow } from '@data-wrangling-components/core'

export interface ExamplesDropdownProps {
	onChange?: (spec: Workflow | undefined) => void
}
