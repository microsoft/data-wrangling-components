/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step, TableContainer } from '@data-wrangling-components/core'
import { DefaultButton } from '@fluentui/react'
import { memo } from 'react'
import styled from 'styled-components'
import { DetailText } from '../../PrepareData/DetailText/index.js'
import { StepCard } from '../../index.js'

export const StepsList: React.FC<{
	steps?: Step[]
	tables?: TableContainer[]
	onDeleteClicked?: (index: number) => void
	onEditClicked?: (step: Step, index: number) => void
	onDuplicateClicked?: (step: Step) => void
	onSelect?: (id: string) => void
	onStartNewStep?: () => void
	buttonId?: string
}> = memo(function StepsList({
	tables,
	steps,
	onDeleteClicked,
	onEditClicked,
	onDuplicateClicked,
	onSelect,
	onStartNewStep,
	buttonId,
}) {
	return (
		<Container>
			{steps?.map((_step, index) => {
				return (
					<StepCard
						onDelete={onDeleteClicked}
						onEdit={onEditClicked}
						onDuplicate={onDuplicateClicked}
						onSelect={onSelect}
						key={index}
						step={_step}
						index={index}
						tables={tables}
					/>
				)
			})}

			{onStartNewStep && (
				<ButtonContainer>
					<DefaultButton
						styles={addButtonStyles}
						iconProps={iconProps.add}
						onClick={onStartNewStep}
						id={buttonId}
					>
						Add step
					</DefaultButton>
					{!steps?.length && (
						<DetailText text="Add your first preparation step" />
					)}
				</ButtonContainer>
			)}
		</Container>
	)
})

const addButtonStyles = { root: { padding: '0 4px 0 6px' } }

const iconProps = {
	add: { iconName: 'Add' },
}

const Container = styled.div`
	display: flex;
	overflow: auto;
	column-gap: 12px;
`

const ButtonContainer = styled.div`
	display: flex;
	align-items: center;
	gap: 18px;
`
