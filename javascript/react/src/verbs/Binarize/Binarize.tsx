/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'

import type { StepComponentProps } from '../../types.js'
import { Filter } from '../Filter/Filter.js'

/**
 * Provides inputs for a Binarize step.
 */
export const Binarize: React.FC<StepComponentProps> = memo(function Binarize(
	props,
) {
	return <Filter {...props} />
})
