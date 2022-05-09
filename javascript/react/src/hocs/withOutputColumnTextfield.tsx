/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { OutputColumnArgs } from '@data-wrangling-components/core'
import { isOutputColumnStep } from '@data-wrangling-components/core'
import { TextField } from '@fluentui/react'
import { memo } from 'react'
import styled from 'styled-components'

import { useTextFieldChangeHandler } from '../hooks/index.js'
import { dropdownStyles , LeftAlignedRow } from '../styles.js'
import type { StepComponentProps } from '../types.js'
import type { HOCFunction } from './types.js'
/**
 * Higher order component generator to wrap a Step in the output column text field.
 * @param label - optional label to use for the textfield instead of the default.
 * @returns
 */
export function withOutputColumnTextfield<T extends OutputColumnArgs>(
	label?: string,
): HOCFunction<StepComponentProps<T>> {
	return Component => {
		const WithOutputColumnTextfield: React.FC<
			StepComponentProps<T>
		> = props => {
			const { step, onChange } = props
			const handleToChange = useTextFieldChangeHandler(
				step,
				(s, val) => (s.args.to = val as string),
				onChange,
			)
			if (!isOutputColumnStep(step)) {
				return <Component {...props} />
			}
			return (
				<Container className="with-output-column-textfield">
					<Component {...props} />
					<LeftAlignedRow>
						<TextField
							required
							label={label || 'New column name'}
							placeholder={'Column name'}
							value={(step.args as OutputColumnArgs).to}
							styles={dropdownStyles}
							onChange={handleToChange}
						/>
					</LeftAlignedRow>
				</Container>
			)
		}
		return memo(WithOutputColumnTextfield)
	}
}

const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	align-content: flex-start;
	justify-content: flex-start;
`
