/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styled from 'styled-components'

export const Text = styled.div`
	color: ${({ theme }) => theme.application().midContrast().hex()};
`
