/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Value } from '@data-wrangling-components/core'
import { Dropdown, IDropdownProps } from '@fluentui/react'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { memo } from 'react'
import { useColumnValueOptions } from '../../common/index.js'
import { columnDropdownStyles } from '../styles.js'

export interface ColumnValueDropdownProps extends Partial<IDropdownProps> {
	column: string
	table?: ColumnTable
	values?: Value[]
	/**
	 * Optional filter function to apply to the values list.
	 */
	filter?: (value: Value) => boolean
}

/**
 * Dropdown wrapper to automatically list the row cell values for a column.
 */
export const ColumnValueDropdown: React.FC<ColumnValueDropdownProps> = memo(
	function ColumnValueDropdown({ column, table, values, filter, ...rest }) {
		const options = useColumnValueOptions(column, table, values, filter)
		return (
			<Dropdown
				label={'Value'}
				placeholder={'Select value'}
				options={options}
				styles={columnDropdownStyles}
				{...rest}
			/>
		)
	},
)
