/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step, TableStore } from '@data-wrangling-components/core'
import { NodeInput } from '@data-wrangling-components/core'
import { ActionButton, IconButton, Label } from '@fluentui/react'
import { memo, useCallback, useMemo } from 'react'
import styled from 'styled-components'

import { noop } from '../../common/functions.js'
import { LeftAlignedRow, useLoadTable } from '../../common/index.js'
import { TableDropdown } from '../../controls/index.js'
import type { StepComponentProps } from '../../types.js'

/**
 * Provides inputs to create a list of tables.
 * E.g., for set operations
 */
export const SetOperation: React.FC<StepComponentProps> = memo(
	function SetOperation({ step, store, table, onChange = noop, input }) {
		const tbl = useLoadTable(
			input || step.input[NodeInput.Source]?.node,
			table,
			store,
		)
		const others = useOthers(step, onChange, store)

		const handleButtonClick = useCallback(() => {
			onChange({
				...step,
				input: {
					...step.input,
					others: [...(step.input.others || []), { node: '' }] as any,
				},
			})
		}, [step, onChange])

		return (
			<Container>
				<Label>With tables</Label>
				{others}
				<ActionButton
					onClick={handleButtonClick}
					iconProps={addIconProps}
					disabled={!tbl}
				>
					Add table
				</ActionButton>
			</Container>
		)
	},
)

function useOthers(
	step: Step,
	onChange: (step: Step) => void,
	store?: TableStore,
) {
	return useMemo(() => {
		return Object.keys(step.input)
			.filter(k => k !== NodeInput.Source)
			.map((inputName, index) => {
				const input = step.input[inputName]!
				const other = input.node

				// on delete, remove the input
				const handleDeleteClick = () => {
					const update = { ...step, inputs: { ...step.input } }
					delete update.inputs[inputName]
					onChange(update)
				}
				if (!store) {
					return null
				}
				return (
					<LeftAlignedRow key={`set-op-${other}-${index}`}>
						<TableDropdown
							label={''}
							store={store}
							selectedKey={other}
							onChange={(_evt, option) => {
								const update = { ...step }
								if (option) {
									input.node = `${option.key}`
								}
								onChange(update)
							}}
						/>
						<IconButton
							title={'Remove this table'}
							iconProps={deleteIconProps}
							onClick={handleDeleteClick}
						/>
					</LeftAlignedRow>
				)
			})
	}, [step, store, onChange])
}

const addIconProps = { iconName: 'Add' }
const deleteIconProps = { iconName: 'Delete' }

const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
`
