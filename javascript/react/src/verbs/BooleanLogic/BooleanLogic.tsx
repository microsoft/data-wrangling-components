/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { BooleanStep } from '@data-wrangling-components/core'
import { BooleanLogicalOperator } from '@data-wrangling-components/core'
import type { IDropdownOption } from '@fluentui/react'
import { Dropdown } from '@fluentui/react'
import { memo, useCallback, useMemo } from 'react'
import styled from 'styled-components'

import { LeftAlignedRow, useLoadTable } from '../../common/index.js'
import { EnumDropdown } from '../../controls/EnumDropdown.js'
import { useHandleDropdownChange } from '../../controls/hooks.js'
import { dropdownStyles } from '../../controls/styles.js'
import type { StepComponentProps } from '../../types.js'

/**
 * Inputs to combine column using boolean logic.
 */
export const BooleanLogic: React.FC<StepComponentProps> = memo(
	function BooleanLogic({ step, store, table, onChange, input }) {
		const internal = useMemo(() => step as BooleanStep, [step])
		const tbl = useLoadTable(input || internal.input, table, store)

		const handleColumnChange = useCallback(
			(_event?: React.FormEvent<HTMLDivElement>, option?: IDropdownOption) => {
				const { columns = [] } = internal.args
				let update = [...columns]
				if (option) {
					if (option.selected) {
						update.push(option.key as string)
					} else {
						update = update.filter(c => c !== option.key)
					}
				}
				onChange &&
					onChange({
						...internal,
						args: {
							...internal.args,
							columns: update,
						},
					})
			},
			[internal, onChange],
		)

		const handleOpChange = useHandleDropdownChange(
			internal,
			'args.operator',
			onChange,
		)

		const options = useMemo(() => {
			const columns = tbl?.columnNames() || []
			const hash = (internal.args.columns || []).reduce((acc, cur) => {
				acc[cur] = true
				return acc
			}, {} as Record<string, boolean>)
			return columns.map(column => {
				const selected = internal.args?.columns && !!hash[column]
				return {
					key: column,
					text: column,
					selected,
				}
			})
		}, [tbl, internal])

		const selectedKeys = useMemo(
			() => options.filter(o => o.selected).map(o => o.key),
			[options],
		)

		return (
			<Container>
				<LeftAlignedRow>
					{tbl ? (
						<Dropdown
							label={'Columns'}
							styles={dropdownStyles}
							multiSelect
							options={options}
							selectedKeys={selectedKeys}
							onChange={handleColumnChange}
						/>
					) : null}
				</LeftAlignedRow>
				<LeftAlignedRow>
					<EnumDropdown
						required
						label={'Logical operator'}
						labels={{
							or: 'OR',
							and: 'AND',
							nor: 'NOR',
							nand: 'NAND',
							xor: 'XOR',
						}}
						enumeration={BooleanLogicalOperator}
						selectedKey={internal.args.operator}
						onChange={handleOpChange}
					/>
				</LeftAlignedRow>
			</Container>
		)
	},
)

const Container = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
`
