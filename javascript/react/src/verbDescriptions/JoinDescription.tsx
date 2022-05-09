/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { JoinArgs } from '@data-wrangling-components/core'
import { NodeInput } from '@essex/dataflow'
import { memo, useMemo } from 'react'

import type { StepDescriptionProps } from '../types.js'
import { VerbDescription } from '../verbForm/VerbDescription.js'

export const JoinDescription: React.FC<StepDescriptionProps<JoinArgs>> = memo(
	function JoinDescription(props) {
		const rows = useMemo(() => {
			const {
				step: { args },
			} = props
			return [
				{
					before: 'with',
					value: props.step.input[NodeInput.Other]?.node,
				},
				{
					before: 'on',
					value: args.on?.join(' | '),
				},
			]
		}, [props])
		return <VerbDescription {...props} rows={rows} />
	},
)
