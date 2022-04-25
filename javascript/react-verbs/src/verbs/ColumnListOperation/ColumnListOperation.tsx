/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { InputColumnListArgs } from '@data-wrangling-components/core'
import { memo } from 'react'

import type { StepComponentProps } from '../../types.js'
import { ColumnListInputs } from '../shared/index.js'
/**
 * Provides inputs for a ColumnListOperation step.
 */
export const ColumnListOperation: React.FC<
	StepComponentProps<InputColumnListArgs>
> = memo(function ColumnListOperation(props) {
	return <ColumnListInputs {...props} />
})
