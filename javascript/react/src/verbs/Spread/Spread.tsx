/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	SpreadArgs,
	SpreadStep,
	Step,
} from '@data-wrangling-components/core'
import { ActionButton, Label } from '@fluentui/react'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import set from 'lodash-es/set.js'
import { memo, useCallback, useMemo } from 'react'
import styled from 'styled-components'

import { useHandleDropdownChange, useLoadTable } from '../../common/index.js'
import { ColumnSpread } from '../../controls/ColumnSpread.js'
import { TableColumnDropdown } from '../../controls/index.js'
import type { StepComponentProps } from '../../types.js'

/**
 * Provides inputs for a step that needs lists of columns.
 */
export const Spread: React.FC<StepComponentProps> = memo(function Spread({
	step,
	store,
	table,
	onChange,
	input,
}) {
	const internal = useMemo(() => step as SpreadStep, [step])

	const tbl = useLoadTable(input || step.input, table, store)
	const columns = useColumns(internal, onChange)

	const handleButtonClick = useCallback(() => {
		onChange &&
			onChange({
				...internal,
				args: {
					...internal.args,
					to: [...internal.args.to, first(tbl)],
				},
			})
	}, [internal, tbl, onChange])

	const handleColumnChange = useHandleDropdownChange(
		step,
		'args.column',
		onChange,
	)

	return (
		<Container>
			<TableColumnDropdown
				required
				table={tbl}
				label={'Column to spread'}
				selectedKey={(step.args as SpreadArgs).column}
				onChange={handleColumnChange}
			/>

			<Label>New column names</Label>

			{columns}
			<ActionButton
				onClick={handleButtonClick}
				iconProps={{ iconName: 'Add' }}
				disabled={!tbl}
			>
				Add column
			</ActionButton>
		</Container>
	)
})

function first(table?: ColumnTable): string {
	return table?.columnNames()[0] as string
}

function useColumns(step: SpreadStep, onChange?: (step: Step) => void) {
	return useMemo(() => {
		return (step.args.to || []).map((column: string, index: number) => {
			const handleColumnChange = (col: string) => {
				const update = { ...step }
				set(update, `args.to[${index}]`, col)
				onChange && onChange(update)
			}

			const handleDeleteClick = () => {
				const update = { ...step }
				update.args.to.splice(index, 1)
				onChange && onChange(update)
			}

			return (
				<ColumnSpread
					key={`column-list-${index}`}
					column={column}
					onChange={handleColumnChange}
					onDelete={handleDeleteClick}
				/>
			)
		})
	}, [step, onChange])
}

const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 12px;
`
