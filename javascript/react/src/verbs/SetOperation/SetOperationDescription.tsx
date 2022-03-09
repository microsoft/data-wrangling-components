/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { SetOperationStep } from '@data-wrangling-components/core'
import { memo, useMemo } from 'react'

import { createRowEntries, VerbDescription } from '../../index.js'
import type { StepDescriptionProps } from '../../types.js'

export const SetOperationDescription: React.FC<StepDescriptionProps> = memo(
	function SetOperationDescription(props) {
		const rows = useMemo(() => {
			const internal = props.step as SetOperationStep
			const { args } = internal
			const sub = createRowEntries(args.others, o => ({ value: o }), 1, props)
			return [
				{
					before: 'with',
					value: args.others.length > 0 ? '' : null,
					sub,
				},
			]
		}, [props])
		return <VerbDescription {...props} rows={rows} />
	},
)
