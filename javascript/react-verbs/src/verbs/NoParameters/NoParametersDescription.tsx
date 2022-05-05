/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { StepDescriptionProps } from '@data-wrangling-components/react-types'
import { memo, useMemo } from 'react'

import { VerbDescription } from '../../common/VerbDescription.js'

export const NoParametersDescription: React.FC<StepDescriptionProps<void>> =
	memo(function NoParametersDescription(props) {
		const rows = useMemo(() => {
			return []
		}, [])
		return <VerbDescription {...props} rows={rows} />
	})
