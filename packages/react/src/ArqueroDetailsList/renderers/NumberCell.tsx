/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { memo } from 'react'
import { useFormattedNumber } from '../hooks'
import { getValue } from '../util/index.js'
import type { FormattedCellProps } from './types.js'

/**
 * Basic endering of number values.
 */
export const NumberCell: React.FC<FormattedCellProps> = memo(
	function NumberCell({ item, column, textAlign = 'right', numberFormat }) {
		const value = getValue(item, column)
		const printed = useFormattedNumber(value, numberFormat)
		return (
			<div
				style={{
					textAlign,
				}}
			>
				{printed}
			</div>
		)
	},
)
