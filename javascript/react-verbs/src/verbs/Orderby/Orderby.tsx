/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	OrderbyArgs,
	OrderbyInstruction,
	Step,
} from '@data-wrangling-components/core'
import { SortInstruction } from '@data-wrangling-components/react-controls'
import { SortDirection } from '@essex/arquero'
import { ActionButton } from '@fluentui/react'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import set from 'lodash-es/set.js'
import { memo, useCallback, useMemo } from 'react'
import styled from 'styled-components'

import { withLoadedTable } from '../../common/withLoadedTable.js'
import type { StepComponentProps } from '../../types.js'

/**
 * Provides inputs for an OrderBy step.
 */
export const Orderby: React.FC<StepComponentProps<OrderbyArgs>> = memo(
	withLoadedTable(function Orderby({ step, onChange, dataTable }) {
		const sorts = useSorts(step, dataTable, onChange)

		const handleButtonClick = useCallback(() => {
			onChange?.({
				...step,
				args: {
					...step.args,
					orders: [...(step.args.orders || []), newSort(dataTable)],
				},
			})
		}, [step, dataTable, onChange])

		return (
			<Container>
				{sorts}
				<ActionButton
					onClick={handleButtonClick}
					iconProps={{ iconName: 'Add' }}
					disabled={!dataTable}
				>
					Add sort
				</ActionButton>
			</Container>
		)
	}),
)

function newSort(table?: ColumnTable): OrderbyInstruction {
	const column = table?.columnNames()[0] as string
	const direction = SortDirection.Ascending
	return {
		column,
		direction,
	}
}

function useSorts(
	step: Step<OrderbyArgs>,
	table?: ColumnTable,
	onChange?: (step: Step<OrderbyArgs>) => void,
) {
	return useMemo(() => {
		return (step.args.orders || []).map((order, index) => {
			const handleSortChange = (order: OrderbyInstruction) => {
				const update = { ...step }
				set(update, `args.orders[${index}]`, order)
				onChange?.(update)
			}

			const handleDeleteClick = () => {
				const update = { ...step }
				update.args.orders.splice(index, 1)
				onChange?.(update)
			}

			return (
				<SortInstruction
					key={`orderby-${order.column}-${index}`}
					table={table}
					order={order}
					onChange={handleSortChange}
					onDelete={handleDeleteClick}
				/>
			)
		})
	}, [step, table, onChange])
}

const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 12px;
`
