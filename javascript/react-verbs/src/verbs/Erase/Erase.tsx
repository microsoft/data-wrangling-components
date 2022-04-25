/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { EraseArgs } from '@data-wrangling-components/core'
import { dropdownStyles } from '@data-wrangling-components/react-controls'
import { TextField } from '@fluentui/react'
import { memo } from 'react'
import styled from 'styled-components'

import {
	LeftAlignedColumn,
	useHandleTextFieldChange,
} from '../../common/index.js'
import type { StepComponentProps } from '../../types.js'
import { ColumnListInputs } from '../shared/index.js'

/**
 * Just the to/value inputs for an impute.
 * Input table is expected to be edited elsewhere and configured as the step input.
 */
export const Erase: React.FC<StepComponentProps<EraseArgs>> = memo(
	function Erase({ step, store, onChange }) {
		const handleValueChange = useHandleTextFieldChange(
			step,
			(s, val) => (s.args.value = val),
			onChange,
		)

		return (
			<Container>
				<LeftAlignedColumn>
					<ColumnListInputs
						label={'Columns to erase'}
						step={step}
						store={store}
						onChange={onChange as any}
					/>
				</LeftAlignedColumn>
				<LeftAlignedColumn>
					<TextField
						required
						label={'Value to be erased'}
						value={step.args.value && `${step.args.value}`}
						placeholder={'text, number, or boolean'}
						styles={dropdownStyles}
						onChange={handleValueChange}
					/>
				</LeftAlignedColumn>
			</Container>
		)
	},
)

const Container = styled.div`
	display: flex;
	justify-content: flex-start;
	flex-wrap: wrap;
	align-content: flex-start;
	flex-direction: column;
`
