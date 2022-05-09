/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo, useMemo } from 'react'

import type { StepDescriptionProps } from '../types.js'
import { VerbDescription } from '../verbForm/VerbDescription.js'

export const NoParametersDescription: React.FC<StepDescriptionProps<void>> =
	memo(function NoParametersDescription(props) {
		const rows = useMemo(() => {
			return []
		}, [])
		return <VerbDescription {...props} rows={rows} />
	})
