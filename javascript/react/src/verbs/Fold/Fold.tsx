/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	ColumnListStep,
	FoldStep,
	Step,
} from '@data-wrangling-components/core'
import { ActionButton, Label, TextField } from '@fluentui/react'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import set from 'lodash-es/set.js'
import { memo, useCallback, useMemo } from 'react'
import styled from 'styled-components'

import {
	LeftAlignedRow,
	useHandleTextfieldChange,
	useLoadTable,
} from '../../common/index.js'
import { ColumnInstruction } from '../../controls/index.js'
import { dropdownStyles } from '../../controls/styles.js'
import type { StepComponentProps } from '../../types.js'

/**
 * Provides inputs for a step that needs lists of columns.
 */
export const Fold: React.FC<StepComponentProps> = memo(function Fold({
	step,
	store,
	table,
	onChange,
	input,
}) {
	const internal = useMemo(() => step as FoldStep, [step])

	const tbl = useLoadTable(input || step.input, table, store)

	const columns = useColumns(internal, tbl, onChange)

	const handleButtonClick = useCallback(() => {
		onChange &&
			onChange({
				...internal,
				args: {
					...internal.args,
					columns: [...internal.args.columns, first(tbl)],
				},
			})
	}, [internal, tbl, onChange])

	const handleToChange = useHandleTextfieldChange(
		internal,
		'args.to[0]',
		onChange,
	)
	const handleToChange2 = useHandleTextfieldChange(
		internal,
		'args.to[1]',
		onChange,
	)

	return (
		<Container>
			<Label>Columns</Label>
			{columns}
			<ActionButton
				onClick={handleButtonClick}
				iconProps={{ iconName: 'Add' }}
				disabled={!tbl}
			>
				Add column
			</ActionButton>

			<LeftAlignedRow>
				<TextField
					required
					label={'Key name to use'}
					placeholder={'Key name to use'}
					value={internal.args.to !== undefined ? internal.args.to[0] : ''}
					styles={dropdownStyles}
					onChange={handleToChange}
				/>
			</LeftAlignedRow>
			<LeftAlignedRow>
				<TextField
					required
					label={'Value name to use'}
					placeholder={'Value name to use'}
					value={internal.args.to !== undefined ? internal.args.to[1] : ''}
					styles={dropdownStyles}
					onChange={handleToChange2}
				/>
			</LeftAlignedRow>
		</Container>
	)
})

function first(table?: ColumnTable): string {
	return table?.columnNames()[0] as string
}

function useColumns(
	step: ColumnListStep,
	table?: ColumnTable,
	onChange?: (step: Step) => void,
) {
	return useMemo(() => {
		return (step.args.columns || []).map((column: string, index: number) => {
			const handleColumnChange = (col: string) => {
				const update = { ...step }
				set(update, `args.columns[${index}]`, col)
				onChange && onChange(update)
			}

			const handleDeleteClick = () => {
				const update = { ...step }
				update.args.columns.splice(index, 1)
				onChange && onChange(update)
			}

			return (
				<LeftAlignedRow key={`column-list-${column}-${index}`}>
					<ColumnInstruction
						table={table}
						column={column}
						onChange={handleColumnChange}
						onDelete={handleDeleteClick}
					/>
				</LeftAlignedRow>
			)
		})
	}, [step, table, onChange])
}

const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
`
