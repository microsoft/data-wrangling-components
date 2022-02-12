/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import React, { memo } from 'react'
import styled from 'styled-components'
import { ArqueroDetailsList, GroupedTable } from '../../'
import { useGroupHeader } from './GroupHeader'
import { useRenderRow } from './RenderTableRow'
import { useColumns, useGroupedTable, useIsTableSelected } from './hooks'

export const TablesList: React.FC<{
	files: GroupedTable[]
	onSelect?: (name: string) => void
	selected?: string
}> = memo(function TablesList({ files, onSelect, selected }) {
	const table = useGroupedTable(files)
	const isTableSelected = useIsTableSelected(selected)
	const groupHeader = useGroupHeader()
	const columns = useColumns(onSelect)
	const renderRow = useRenderRow(isTableSelected)

	return (
		<ListContainer>
			<ArqueroDetailsList
				isHeaderVisible={false}
				table={table}
				columns={[...columns]}
				visibleColumns={['name', 'group']}
				onRenderGroupHeader={groupHeader}
				onRenderRow={renderRow}
				compact
			/>
		</ListContainer>
	)
})

const ListContainer = styled.div`
	flex: 1;
	display: flex;
	flex-direction: column;
	overflow: auto;
	width: 100%;
`