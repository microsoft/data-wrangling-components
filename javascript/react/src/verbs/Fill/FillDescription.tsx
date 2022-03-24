/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { FillStep } from '@data-wrangling-components/core'
import { memo, useMemo } from 'react'

import { VerbDescription } from '../../index.js'
import type { StepDescriptionProps } from '../../types.js'

export const FillDescription: React.FC<StepDescriptionProps> = memo(
	function FillDescription(props) {
		const rows = useMemo(() => {
			const internal = props.step as FillStep
			const { args } = internal
			return [
				{
					before: 'with value',
					value: args.value,
				},
			]
		}, [props])
		return <VerbDescription {...props} rows={rows} />
	},
)
