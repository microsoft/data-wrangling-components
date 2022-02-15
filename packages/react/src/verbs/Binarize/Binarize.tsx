/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'
import styled from 'styled-components'
import { FilterInputs } from '../../controls/index.js'
import type { StepComponentProps } from '../../types.js'

/**
 * Provides inputs for a Binarize step.
 */
export const Binarize: React.FC<StepComponentProps> = memo(function Binarize(
	props,
) {
	return (
		<Container>
			<FilterInputs {...props} />
		</Container>
	)
})

const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
`
