/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { BinStep } from '@data-wrangling-components/core'
import { BinStrategy } from '@data-wrangling-components/core'
import { memo, useMemo } from 'react'

import { VerbDescription } from '../../index.js'
import type { StepDescriptionProps } from '../../types.js'

export const BinDescription: React.FC<StepDescriptionProps> = memo(
	function BinDescription(props) {
		const rows = useMemo(() => {
			const internal = props.step as BinStep
			const { args } = internal
			return [
				{
					before: 'column',
					value: args.column,
					sub: [
						{
							before: 'using',
							value: args.strategy,
							after: 'strategy',
							sub:
								args.strategy &&
								args.strategy !== BinStrategy.Auto &&
								args.strategy
									? [
											{
												value:
													args.strategy === BinStrategy.FixedCount
														? args.fixedcount
														: args.fixedwidth,
												after:
													args.strategy === BinStrategy.FixedCount
														? 'bins'
														: 'bin width',
											},
											{
												before: 'min',
												value: args.min,
											},
											{
												before: 'max',
												value: args.max,
											},
											{
												value: args.clamped ? 'clamped' : 'not clamped',
											},
									  ]
									: undefined,
						},
					],
				},
			]
		}, [props])
		return <VerbDescription {...props} rows={rows} />
	},
)
