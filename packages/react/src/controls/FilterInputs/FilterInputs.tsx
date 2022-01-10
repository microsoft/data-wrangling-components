/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { FilterStep } from '@data-wrangling-components/core'
import React, { memo, useMemo } from 'react'
import styled from 'styled-components'
import {
	useLoadTable,
	LeftAlignedRow,
	useHandleDropdownChange,
} from '../../common'

import { StepComponentProps } from '../../types'
import { FilterFunction } from '../FilterFunction'
import { TableColumnDropdown } from '../dropdowns/TableColumnDropdown'

/**
 * The filter inputs for a step.
 * Input table is expected to be provided in the step input.
 */
export const FilterInputs: React.FC<StepComponentProps> = memo(
	function FilterInputs({ step, store, table, onChange, input }) {
		const internal = useMemo(() => step as FilterStep, [step])

		const tbl = useLoadTable(input || step.input, table, store)

		const handleLeftColumnChange = useHandleDropdownChange(
			internal,
			'args.column',
			onChange,
		)

		return (
			<Container>
				<LeftAlignedRow>
					<TableColumnDropdown
						table={tbl}
						required
						selectedKey={internal.args.column}
						onChange={handleLeftColumnChange}
					/>
					<FilterFunction
						input={input}
						step={step}
						store={store}
						onChange={onChange}
					/>
				</LeftAlignedRow>
			</Container>
		)
	},
)

const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
`
