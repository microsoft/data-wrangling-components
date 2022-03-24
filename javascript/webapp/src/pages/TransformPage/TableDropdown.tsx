/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TableContainer } from '@data-wrangling-components/core'
import type { IDropdownProps } from '@fluentui/react'
import { Dropdown } from '@fluentui/react'
import { memo, useMemo } from 'react'

export interface TableDropdownProps extends Omit<IDropdownProps, 'options'> {
	tables: TableContainer[]
}

export const TableDropdown: React.FC<TableDropdownProps> = memo(
	function TableDropdown(props) {
		const { tables } = props

		const tableOptions = useMemo(() => {
			return (
				tables?.map(t => ({
					key: t.id,
					text: t.id,
				})) || []
			)
		}, [tables])

		return (
			<Dropdown
				styles={{
					root: {
						width: 300,
					},
				}}
				options={tableOptions}
				{...props}
			/>
		)
	},
)
