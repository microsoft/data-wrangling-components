/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { PivotStep } from '@data-wrangling-components/core'
import { memo, useMemo } from 'react'
import styled from 'styled-components'

import {
	LeftAlignedRow,
	useHandleDropdownChange,
	useLoadTable,
} from '../../common/index.js'
import { TableColumnDropdown } from '../../controls/index.js'
import type { StepComponentProps } from '../../types'

/**
 * Just the group/column/op inputs for an aggregation.
 * Input table is expected to be edited elsewhere and configured as the step input.
 */
export const Unfold: React.FC<StepComponentProps> = memo(function Unfold({
	step,
	store,
	table,
	onChange,
	input,
}) {
	const internal = useMemo(() => step as PivotStep, [step])

	const tbl = useLoadTable(input || internal.input, table, store)

	const handleKeyColumnChange = useHandleDropdownChange(
		internal,
		'args.key',
		onChange,
	)

	const handleValueColumnChange = useHandleDropdownChange(
		internal,
		'args.value',
		onChange,
	)

	return (
		<Container>
			<LeftAlignedRow>
				<TableColumnDropdown
					required
					table={tbl}
					label={'Column used as key'}
					selectedKey={internal.args.key}
					onChange={handleKeyColumnChange}
				/>
			</LeftAlignedRow>
			<LeftAlignedRow>
				<TableColumnDropdown
					required
					table={tbl}
					label={'Column used as value'}
					selectedKey={internal.args.value}
					onChange={handleValueColumnChange}
				/>
			</LeftAlignedRow>
		</Container>
	)
})

const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	align-content: flex-start;
	justify-content: flex-start;
`
