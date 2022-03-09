/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { MergeStrategy } from '@data-wrangling-components/core'
import type { IDropdownProps } from '@fluentui/react'
import { Dropdown } from '@fluentui/react'
import { memo } from 'react'

import { opDropdownStyles } from '../styles.js'

export type MergeStrategyDropdownProps = Partial<IDropdownProps>

/**
 * Dropdown wrapper to list out numeric comparison operations.
 */
export const MergeStrategyDropdown: React.FC<MergeStrategyDropdownProps> = memo(
	function NumericComparisonOperatorDropdown(props) {
		return (
			<Dropdown
				required
				label={'Strategy'}
				options={options}
				styles={opDropdownStyles}
				{...props}
			/>
		)
	},
)

const options = Object.values(MergeStrategy).map(o => ({
	key: o,
	text: o,
}))
