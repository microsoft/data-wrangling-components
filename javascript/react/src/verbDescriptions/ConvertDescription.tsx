/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ConvertArgs } from '@data-wrangling-components/core'
import { ParseType } from '@data-wrangling-components/core'
import { memo, useMemo } from 'react'

import type { StepDescriptionProps } from '../types.js'
import { createRowEntries } from '../verbForm/createRowEntries.js'
import { VerbDescription } from '../verbForm/VerbDescription.js'

export const ConvertDescription: React.FC<StepDescriptionProps<ConvertArgs>> =
	memo(function ConvertDescription(props) {
		const rows = useMemo(() => {
			const {
				step: { args },
			} = props
			const sub = createRowEntries(
				args.columns,
				c => ({
					value: c,
				}),
				3,
				props,
			)
			return [
				{
					before: `convert column${args.columns?.length !== 1 ? 's' : ''}`,
					value: args.columns.length === 0 ? undefined : '',
					sub,
				},
				{
					before: 'to type',
					value: args.type,
					sub:
						args.type === ParseType.Integer
							? [
									{
										before: 'with base',
										value: args.radix,
									},
							  ]
							: undefined,
				},
			]
		}, [props])
		return <VerbDescription {...props} rows={rows} />
	})
